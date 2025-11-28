import https from 'https';
import { logger } from '../utils/logger';

export interface CodeExecutionRequest {
  language: string;
  code: string;
  input?: string;
  timeLimit?: number;
  mode?: 'simple' | 'secure'; // New: choose execution mode
}

export interface CodeExecutionResponse {
  output: string;
  error: string | null;
  executionTime: number;
  memoryUsage?: number;
  status: 'success' | 'error' | 'timeout' | 'memory_limit_exceeded' | 'file_size_limit_exceeded';
}

export class OptimizedCodeExecutionService {
  private readonly RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
  private readonly RAPIDAPI_HOST = 'online-code-compiler.p.rapidapi.com';
  private readonly DEFAULT_TIMEOUT = 10000;

  // Simplified security patterns for basic protection
  private readonly BASIC_DANGERS = [
    /require\s*\(\s*['"`]fs['"`]\s*\)/i,
    /require\s*\(\s*['"`]child_process['"`]\s*\)/i,
    /eval\s*\(/i
  ];

  // Comprehensive security patterns for secure mode
  private readonly COMPREHENSIVE_DANGERS = [
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
    /child_process\./i,
    /__import__/i,
    /import\s+os/i,
    /import\s+subprocess/i,
    /import\s+sys/i,
    /os\.system/i,
    /os\.popen/i,
    /subprocess\./i
  ];

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

  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    const startTime = Date.now();
    const mode = request.mode || 'secure'; // Default to secure mode

    try {
      // Adaptive security based on mode
      const securityLevel = mode === 'simple' ? this.BASIC_DANGERS : this.COMPREHENSIVE_DANGERS;
      this.validateCodeSecurity(request.code, securityLevel);

      // Adaptive timeout
      const timeout = Math.min(request.timeLimit || this.DEFAULT_TIMEOUT, 30000); // Max 30 seconds

      const result = await Promise.race([
        this.executeWithRapidAPI(request),
        this.createTimeoutPromise(timeout)
      ]);

      return {
        ...result,
        executionTime: Date.now() - startTime
      };

    } catch (error) {
      logger.error('Code execution error:', error);
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
        status: 'error'
      };
    }
  }

  private validateCodeSecurity(code: string, patterns: RegExp[]): void {
    for (const pattern of patterns) {
      if (pattern.test(code)) {
        throw new Error(`Security violation: potentially dangerous pattern detected`);
      }
    }
  }

  private async executeWithRapidAPI(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    return new Promise((resolve, reject) => {
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
          try {
            const body = Buffer.concat(chunks);
            const response = JSON.parse(body.toString());
            
            resolve({
              output: response.output || '',
              error: response.error || null,
              executionTime: 0, // Will be set by caller
              memoryUsage: 0,
              status: response.error ? 'error' : 'success'
            });
          } catch (parseError) {
            reject(new Error(`API response parsing failed: ${parseError}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`Request failed: ${error.message}`));
      });

      req.write(postData);
      req.end();
    });
  }

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

  getSupportedLanguages(): string[] {
    return Object.keys(this.LANGUAGE_MAP);
  }

  isLanguageSupported(language: string): boolean {
    return language.toLowerCase() in this.LANGUAGE_MAP;
  }
}

export const optimizedCodeExecutionService = new OptimizedCodeExecutionService();