import https from 'https';
import { logger } from '../utils/logger';

export interface CodeExecutionRequest {
  language: string;
  code: string;
  input?: string;
  timeLimit?: number;
  memoryLimit?: number;
}

export interface CodeExecutionResponse {
  output: string;
  error: string | null;
  executionTime: number;
  memoryUsage: number;
  status: 'success' | 'error' | 'timeout' | 'memory_limit_exceeded' | 'file_size_limit_exceeded';
}

export class Judge0CodeExecutionService {
  private readonly BASE_URL = 'https://ce.judge0.com';
  private readonly DEFAULT_TIMEOUT = 10000;
  private readonly MAX_CODE_SIZE = 100000; // 100KB max code size
  private readonly MAX_OUTPUT_SIZE = 50000; // 50KB max output size
  
  // Language mapping to Judge0 language IDs
  private readonly LANGUAGE_MAP: Record<string, number> = {
    'javascript': 63, // JavaScript (Node.js)
    'python': 71, // Python 3
    'java': 62, // Java (OpenJDK)
    'cpp': 54, // C++ (GCC 9.2.0)
    'c': 50, // C (GCC 9.2.0)
    'go': 60, // Go (1.13.5)
    'rust': 73, // Rust (1.40.0)
    'php': 68, // PHP (7.4.1)
    'ruby': 72, // Ruby (2.7.0)
    'swift': 83, // Swift (5.2.2)
    'kotlin': 78, // Kotlin (1.3.70)
    'typescript': 74 // TypeScript (3.7.2)
  };

  /**
   * Execute code using Judge0 API with fallback mechanisms
   */
  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    const startTime = Date.now();
    
    try {
      // Validate code size to prevent file size limit errors
      if (request.code.length > this.MAX_CODE_SIZE) {
        return {
          output: '',
          error: `Code size exceeds limit of ${this.MAX_CODE_SIZE} characters`,
          executionTime: Date.now() - startTime,
          memoryUsage: 0,
          status: 'error'
        };
      }

      const languageId = this.LANGUAGE_MAP[request.language];
      if (!languageId) {
        return {
          output: '',
          error: `Unsupported language: ${request.language}`,
          executionTime: Date.now() - startTime,
          memoryUsage: 0,
          status: 'error'
        };
      }

      // Try execution with retry mechanism for file size errors
      const maxRetries = 2;
      let lastError: any = null;
      
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          logger.info(`[COMPILER] Attempt ${attempt} execution for ${request.language}`, {
            codeLength: request.code.length,
            hasInput: !!request.input
          });

          // Submit code for execution with reduced complexity for retries
          const submissionResponse = await this.submitCode({
            language_id: languageId,
            source_code: attempt > 1 ? this.simplifyCode(request.code) : request.code,
            stdin: request.input || ''
          });

          if (!submissionResponse.token) {
            lastError = new Error('Failed to get submission token');
            continue;
          }

          // Wait for execution to complete
          const timeout = request.timeLimit || this.DEFAULT_TIMEOUT;
          const result = await this.waitForResult(submissionResponse.token, timeout);

          // Map Judge0 status to our response format
          const status = this.mapStatus(result.status?.id);
          
          // Truncate output if it exceeds limits to prevent memory issues
          let output = result.stdout || '';
          if (output.length > this.MAX_OUTPUT_SIZE) {
            output = output.substring(0, this.MAX_OUTPUT_SIZE) + '\n\n[Output truncated due to size limits]';
          }

          // Handle specific errors with appropriate messages
          if (status === 'file_size_limit_exceeded') {
            if (attempt < maxRetries) {
              logger.warn(`[COMPILER] File size limit error, retrying with simplified code (attempt ${attempt})`);
              continue; // Retry with simplified code
            } else {
              return {
                output: '',
                error: 'File size limit exceeded. Your code may be too complex for the current execution environment. Try simplifying your logic or using a simpler approach.',
                executionTime: Date.now() - startTime,
                memoryUsage: result.memory || 0,
                status
              };
            }
          }

          // Check for compilation errors and provide helpful messages
          if (status === 'error' && result.compile_output) {
            const compileError = result.compile_output.toLowerCase();
            if (compileError.includes('file size limit') || compileError.includes('core dumped')) {
              if (attempt < maxRetries) {
                logger.warn(`[COMPILER] Compilation file size error, retrying (attempt ${attempt})`);
                continue;
              }
            }
          }
          
          return {
            output,
            error: result.stderr || result.compile_output || null,
            executionTime: Date.now() - startTime,
            memoryUsage: result.memory || 0,
            status
          };

        } catch (attemptError) {
          lastError = attemptError;
          logger.error(`[COMPILER] Execution attempt ${attempt} failed:`, attemptError);
          
          // If it's the last attempt, break
          if (attempt === maxRetries) break;
          
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }

      // All retries failed
      throw lastError || new Error('All execution attempts failed');

    } catch (error) {
      logger.error('Judge0 execution error:', error);
      
      // Check if this is a file size limit error
      if (error instanceof Error) {
        const errorMessage = error.message.toLowerCase();
        if (errorMessage.includes('file size limit') || errorMessage.includes('core dumped')) {
          return {
            output: '',
            error: 'File size limit exceeded. The compiled program is too large for the execution environment. Please simplify your code or reduce its complexity.',
            executionTime: Date.now() - startTime,
            memoryUsage: 0,
            status: 'file_size_limit_exceeded'
          };
        }
      }
      
      return {
        output: '',
        error: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try simplifying your code or check your syntax.`,
        executionTime: Date.now() - startTime,
        memoryUsage: 0,
        status: 'error'
      };
    }
  }

  /**
   * Simplify code for retry attempts
   */
  private simplifyCode(code: string): string {
    // Remove comments to reduce code size
    const lines = code.split('\n');
    const simplifiedLines = lines.filter(line => {
      const trimmed = line.trim();
      return !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.endsWith('*/');
    });
    
    return simplifiedLines.join('\n');
  }

  /**
   * Submit code to Judge0
   */
  private submitCode(data: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(data);
      
      const options = {
        method: 'POST',
        hostname: 'ce.judge0.com',
        port: 443,
        path: '/submissions/?base64_encoded=false&wait=false',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        const chunks: Buffer[] = [];
        
        res.on('data', (chunk) => chunks.push(chunk));
        
        res.on('end', () => {
          try {
            const body = Buffer.concat(chunks);
            const response = JSON.parse(body.toString());
            resolve(response);
          } catch (parseError) {
            reject(new Error('Failed to parse submission response'));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Submission request failed: ${error.message}`));
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * Wait for execution result
   */
  private waitForResult(token: string, timeout: number): Promise<any> {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      
      const checkResult = () => {
        const elapsed = Date.now() - startTime;
        if (elapsed >= timeout) {
          reject(new Error(`Execution timeout after ${timeout}ms`));
          return;
        }

        const options = {
          method: 'GET',
          hostname: 'ce.judge0.com',
          port: 443,
          path: `/submissions/${token}?base64_encoded=false`,
          headers: {
            'Content-Type': 'application/json'
          }
        };

        const req = https.request(options, (res) => {
          const chunks: Buffer[] = [];
          
          res.on('data', (chunk) => chunks.push(chunk));
          
          res.on('end', () => {
            try {
              const body = Buffer.concat(chunks);
              const result = JSON.parse(body.toString());
              
              // Check if execution is complete
              if (result.status && result.status.id >= 3) {
                resolve(result);
              } else {
                // Wait and check again
                setTimeout(checkResult, 1000);
              }
            } catch (parseError) {
              reject(new Error('Failed to parse result response'));
            }
          });
        });

        req.on('error', (error) => {
          reject(new Error(`Result request failed: ${error.message}`));
        });

        req.end();
      };

      checkResult();
    });
  }

  /**
   * Map Judge0 status to our status format
   */
  private mapStatus(judge0StatusId?: number): 'success' | 'error' | 'timeout' | 'memory_limit_exceeded' | 'file_size_limit_exceeded' {
    if (!judge0StatusId) return 'error';
    
    // Judge0 status IDs:
    // 1: In Queue
    // 2: Processing
    // 3: Accepted
    // 4: Wrong Answer
    // 5: Time Limit Exceeded
    // 6: Compilation Error
    // 7: Runtime Error (SIGSEGV) - Segmentation fault
    // 8: Runtime Error (SIGXFSZ) - File size limit exceeded
    // 9: Runtime Error (SIGFPE) - Floating point exception
    // 10: Runtime Error (SIGABRT) - Abort
    // 11: Runtime Error (NZEC) - Non-zero exit code
    // 12: Runtime Error (Other)
    // 13: Internal Error
    // 14: Exec Format Error
    
    switch (judge0StatusId) {
      case 3: return 'success';
      case 5: return 'timeout';
      case 8: return 'file_size_limit_exceeded'; // SIGXFSZ - File size limit exceeded
      case 7: return 'memory_limit_exceeded'; // SIGSEGV - Could be memory-related
      case 6: return 'error'; // Compilation Error
      case 9:
      case 10:
      case 11:
      case 12: return 'error';
      default: return 'error';
    }
  }

  /**
   * Get supported languages
   */
  getSupportedLanguages(): string[] {
    return Object.keys(this.LANGUAGE_MAP);
  }

  /**
   * Check if language is supported
   */
  isLanguageSupported(language: string): boolean {
    return language.toLowerCase() in this.LANGUAGE_MAP;
  }

  /**
   * Basic syntax validation
   */
  validateSyntax(code: string, language: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        // Basic JS/TS syntax checks
        if (this.hasUnclosedBraces(code)) {
          errors.push('Unclosed braces detected');
        }
        if (this.hasUnclosedParentheses(code)) {
          errors.push('Unclosed parentheses detected');
        }
        break;

      case 'python':
        // Basic Python syntax checks
        if (this.hasMismatchedIndentation(code)) {
          errors.push('Indentation error detected');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  private hasUnclosedBraces(code: string): boolean {
    let braceCount = 0;
    for (const char of code) {
      if (char === '{') braceCount++;
      if (char === '}') braceCount--;
      if (braceCount < 0) break;
    }
    return braceCount !== 0;
  }

  private hasUnclosedParentheses(code: string): boolean {
    let parenCount = 0;
    for (const char of code) {
      if (char === '(') parenCount++;
      if (char === ')') parenCount--;
      if (parenCount < 0) break;
    }
    return parenCount !== 0;
  }

  private hasMismatchedIndentation(code: string): boolean {
    const lines = code.split('\n');
    let expectedIndent = 0;
    
    for (const line of lines) {
      if (line.trim() === '') continue;
      
      const actualIndent = line.match(/^\s*/)?.[0].length || 0;
      
      // Simple check - if indent decreases by more than expected, flag as error
      if (actualIndent % 4 !== 0 && actualIndent !== 0) {
        return true;
      }
    }
    
    return false;
  }
}

// Export singleton instance
export const judge0CodeExecutionService = new Judge0CodeExecutionService();