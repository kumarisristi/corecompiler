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

export class CodeExecutionService {
  private readonly RAPIDAPI_KEY = 'c1ca5df916msha636cb7af4c507cp16e40fjsn15ef7fba3e8a';
  private readonly RAPIDAPI_HOST = 'online-code-compiler.p.rapidapi.com';
  
  // Security measures
  private readonly MAX_CODE_LENGTH = 50000; // 50KB
  private readonly MAX_EXECUTION_TIME = 10000; // 10 seconds
  private readonly DANGEROUS_PATTERNS = [
    /while\s*\(\s*true\s*\)/i,
    /for\s*\(\s*;;\s*\)/i,
    /eval\s*\(/i,
    /Function\s*\(/i,
    /require\s*\(\s*['"`]fs['"`]\s*\)/i,
    /require\s*\(\s*['"`]child_process['"`]\s*\)/i,
    /import\s+fs/i,
    /import\s+child_process/i,
    /process\.exit/i,
    /process\.kill/i,
    /__dirname/i,
    /__filename/i,
    /fs\./i,
    /child_process\./i
  ];

  // Language mapping to API format
  private readonly LANGUAGE_MAP: Record<string, string> = {
    'javascript': 'nodejs',
    'python': 'python3',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'go': 'go',
    'rust': 'rust',
    'php': 'php',
    'ruby': 'ruby',
    'swift': 'swift',
    'kotlin': 'kotlin'
  };

  /**
   * Execute code with security checks and timeout protection
   */
  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    const startTime = Date.now();
    
    try {
      // Security validations
      const securityCheck = this.validateCodeSecurity(request.code, request.language);
      if (!securityCheck.isValid) {
        return {
          output: '',
          error: `Security violation: ${securityCheck.reason}`,
          executionTime: Date.now() - startTime,
          memoryUsage: 0,
          status: 'error'
        };
      }

      // Length validation
      if (request.code.length > this.MAX_CODE_LENGTH) {
        return {
          output: '',
          error: `Code length exceeds limit of ${this.MAX_CODE_LENGTH} characters`,
          executionTime: Date.now() - startTime,
          memoryUsage: 0,
          status: 'error'
        };
      }

      // Timeout wrapper
      return await Promise.race([
        this.executeWithRapidAPI(request),
        this.createTimeoutPromise(this.MAX_EXECUTION_TIME)
      ]);

    } catch (error) {
      logger.error('Code execution error:', error);
      return {
        output: '',
        error: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: Date.now() - startTime,
        memoryUsage: 0,
        status: 'error'
      };
    }
  }

  /**
   * Security validation to prevent malicious code
   */
  private validateCodeSecurity(code: string, language: string): { isValid: boolean; reason?: string } {
    // Check for dangerous patterns
    for (const pattern of this.DANGEROUS_PATTERNS) {
      if (pattern.test(code)) {
        return {
          isValid: false,
          reason: `Code contains potentially dangerous pattern: ${pattern.source}`
        };
      }
    }

    // Language-specific security checks
    switch (language.toLowerCase()) {
      case 'python':
        if (this.containsPythonMaliciousCode(code)) {
          return { isValid: false, reason: 'Python code contains malicious patterns' };
        }
        break;
      
      case 'javascript':
        if (this.containsJSMaliciousCode(code)) {
          return { isValid: false, reason: 'JavaScript code contains malicious patterns' };
        }
        break;
    }

    return { isValid: true };
  }

  private containsPythonMaliciousCode(code: string): boolean {
    const maliciousPatterns = [
      /import\s+os/i,
      /import\s+subprocess/i,
      /import\s+sys/i,
      /os\.system/i,
      /os\.popen/i,
      /subprocess\./i,
      /__import__/i
    ];
    
    return maliciousPatterns.some(pattern => pattern.test(code));
  }

  private containsJSMaliciousCode(code: string): boolean {
    const maliciousPatterns = [
      /import\s+fs/i,
      /import\s+path/i,
      /import\s+os/i,
      /require\s*\(\s*['"`]fs['"`]\s*\)/i,
      /require\s*\(\s*['"`]os['"`]\s*\)/i,
      /require\s*\(\s*['"`]child_process['"`]\s*\)/i,
      /fs\./i,
      /child_process\./i,
      /process\./i
    ];
    
    return maliciousPatterns.some(pattern => pattern.test(code));
  }

  /**
   * Execute code using RapidAPI
   */
  private async executeWithRapidAPI(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    return new Promise((resolve) => {
      const apiLanguage = this.LANGUAGE_MAP[request.language] || request.language;
      
      const postData = JSON.stringify({
        language: apiLanguage,
        version: 'latest',
        code: request.code,
        input: request.input || null
      });

      const options = {
        method: 'POST',
        hostname: this.RAPIDAPI_HOST,
        port: null,
        path: '/v1/',
        headers: {
          'x-rapidapi-key': this.RAPIDAPI_KEY,
          'x-rapidapi-host': this.RAPIDAPI_HOST,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        const chunks: Buffer[] = [];

        res.on('data', (chunk) => {
          chunks.push(chunk);
        });

        res.on('end', () => {
          const body = Buffer.concat(chunks);
          try {
            const response = JSON.parse(body.toString());
            resolve({
              output: response.output || '',
              error: response.error || null,
              executionTime: Date.now() - (Date.now() - 0), // Will be set by caller
              memoryUsage: 0,
              status: response.error ? 'error' : 'success'
            });
          } catch (parseError) {
            resolve({
              output: '',
              error: `API response parsing failed: ${parseError}`,
              executionTime: 0,
              memoryUsage: 0,
              status: 'error'
            });
          }
        });
      });

      req.on('error', (error) => {
        resolve({
          output: '',
          error: `Request failed: ${error.message}`,
          executionTime: 0,
          memoryUsage: 0,
          status: 'error'
        });
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * Create timeout promise
   */
  private createTimeoutPromise(timeoutMs: number): Promise<CodeExecutionResponse> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          output: '',
          error: `Execution timeout after ${timeoutMs}ms`,
          executionTime: timeoutMs,
          memoryUsage: 0,
          status: 'timeout'
        });
      }, timeoutMs);
    });
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
   * Validate code syntax (basic validation)
   */
  validateSyntax(code: string, language: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    switch (language.toLowerCase()) {
      case 'javascript':
      case 'typescript':
        // Basic JS syntax checks
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
export const codeExecutionService = new CodeExecutionService();