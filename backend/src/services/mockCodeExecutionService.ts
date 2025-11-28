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
  status: 'success' | 'error' | 'timeout' | 'memory_limit_exceeded';
}

export class MockCodeExecutionService {
  private readonly DEFAULT_TIMEOUT = 5000;
  private readonly DEFAULT_MEMORY = 10000; // KB

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
   * Mock implementation for code execution
   * Simulates real execution without external API
   */
  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    const startTime = Date.now();
    
    try {
      // Simulate execution time based on code complexity
      const executionTime = this.simulateExecutionTime(request.code);
      
      // Simulate memory usage
      const memoryUsage = this.calculateMemoryUsage(request.code);
      
      // Check for timeout
      const timeout = request.timeLimit || this.DEFAULT_TIMEOUT;
      if (executionTime > timeout) {
        return {
          output: '',
          error: `Execution timeout after ${timeout}ms`,
          executionTime: timeout,
          memoryUsage: 0,
          status: 'timeout'
        };
      }

      // Generate mock output based on language and code
      const output = this.generateMockOutput(request.language, request.code);
      
      // Simulate random errors (5% chance)
      if (Math.random() < 0.05) {
        return {
          output: '',
          error: this.generateMockError(request.language, request.code),
          executionTime: Date.now() - startTime,
          memoryUsage: 0,
          status: 'error'
        };
      }

      return {
        output,
        error: null,
        executionTime: Date.now() - startTime,
        memoryUsage,
        status: 'success'
      };

    } catch (error) {
      logger.error('Mock execution error:', error);
      return {
        output: '',
        error: error instanceof Error ? error.message : 'Unknown error',
        executionTime: Date.now() - startTime,
        memoryUsage: 0,
        status: 'error'
      };
    }
  }

  private simulateExecutionTime(code: string): number {
    // Simple simulation: longer code = more time
    const baseTime = 100; // 100ms base
    const codeComplexity = code.length * 0.5; // 0.5ms per character
    const randomDelay = Math.random() * 200; // 0-200ms random delay
    
    return Math.min(baseTime + codeComplexity + randomDelay, 1000);
  }

  private calculateMemoryUsage(code: string): number {
    // Simple memory calculation
    const baseMemory = 1000; // 1MB base
    const codeMemory = code.length * 2; // 2 bytes per character
    return Math.min(baseMemory + codeMemory, 50000); // Max 50MB
  }

  private generateMockOutput(language: string, code: string): string {
    const normalizedLanguage = this.LANGUAGE_MAP[language] || language;
    
    // Python simulation
    if (normalizedLanguage === 'python3' || language === 'python') {
      if (code.includes('print(')) {
        const printMatches = code.match(/print\(['"]([^'"]*)['"]\)/g);
        if (printMatches) {
          return printMatches
            .map(match => match.match(/print\(['"]([^'"]*)['"]\)/)?.[1] || '')
            .filter(output => output)
            .join('\n');
        }
      }
      
      if (code.includes('input(')) {
        return 'Mock input processed';
      }
      
      if (code.includes('=')) {
        return 'Variables created and computed successfully';
      }
      
      return 'Python code executed successfully\nNo specific output generated';
    }

    // JavaScript simulation
    if (normalizedLanguage === 'nodejs' || language === 'javascript') {
      if (code.includes('console.log(')) {
        const logMatches = code.match(/console\.log\(['"]([^'"]*)['"]\)/g);
        if (logMatches) {
          return logMatches
            .map(match => match.match(/console\.log\(['"]([^'"]*)['"]\)/)?.[1] || '')
            .filter(output => output)
            .join('\n');
        }
      }
      
      if (code.includes('console.log')) {
        return 'JavaScript executed successfully';
      }
      
      return 'Node.js code executed successfully';
    }

    // Generic simulation for other languages
    return `${normalizedLanguage} code executed successfully\nExecution completed without errors\nMemory used: ${this.calculateMemoryUsage(code)} bytes`;
  }

  private generateMockError(language: string, code: string): string {
    const errors = [
      'Runtime Error: Undefined variable',
      'Syntax Error: Unexpected token',
      'Runtime Error: Division by zero',
      'Memory Error: Out of memory',
      'Timeout Error: Code took too long',
      'Runtime Error: Null reference exception',
      'Syntax Error: Missing semicolon',
      'Runtime Error: Array index out of bounds'
    ];
    
    return errors[Math.floor(Math.random() * errors.length)] || 'Mock execution error';
  }

  getSupportedLanguages(): string[] {
    return Object.keys(this.LANGUAGE_MAP);
  }

  isLanguageSupported(language: string): boolean {
    return language.toLowerCase() in this.LANGUAGE_MAP;
  }

  /**
   * Mock syntax validation
   */
  validateSyntax(code: string, language: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const normalizedLanguage = this.LANGUAGE_MAP[language] || language;

    // Basic syntax checks
    switch (normalizedLanguage) {
      case 'python3':
      case 'python':
        if (code.includes('print(') && !code.includes(')')) {
          errors.push('Python: Missing closing parenthesis in print statement');
        }
        if (code.includes('input(') && !code.includes(')')) {
          errors.push('Python: Missing closing parenthesis in input statement');
        }
        break;
        
      case 'nodejs':
      case 'javascript':
        if (code.includes('console.log(') && !code.includes(')')) {
          errors.push('JavaScript: Missing closing parenthesis in console.log');
        }
        if (code.includes('function') && !code.includes('{')) {
          errors.push('JavaScript: Missing opening brace in function');
        }
        break;
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
export const mockCodeExecutionService = new MockCodeExecutionService();