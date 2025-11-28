// API Configuration for connecting frontend to backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export interface CodeExecutionRequest {
  language: string;
  code: string;
  input?: string;
  timeLimit?: number;
  memoryLimit?: number;
}

export interface CodeExecutionResponse {
  success: boolean;
  data?: {
    output: string;
    error: string | null;
    executionTime: number;
    memoryUsage: number;
    status: string;
  };
  error?: string;
  message?: string;
}

export interface LanguageResponse {
  success: boolean;
  data?: {
    languages: string[];
    count: number;
  };
}

export interface ValidationRequest {
  code: string;
  language: string;
}

export interface ValidationResponse {
  success: boolean;
  data?: {
    isValid: boolean;
    errors: string[];
  };
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  /**
   * Execute code using the backend API
   */
  async executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/compiler/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        return {
          success: false,
          error: errorData.error || `HTTP ${response.status}: ${response.statusText}`,
          message: errorData.message || 'Failed to execute code'
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network connection failed',
        message: 'Please check if the backend server is running on port 5000'
      };
    }
  }

  /**
   * Get list of supported languages
   */
  async getLanguages(): Promise<LanguageResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/compiler/languages`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Filter out non-executable languages (markup, styling, frameworks)
      const executableLanguages = data.data.languages.filter((lang: string) => {
        const nonExecutable = ['html', 'css', 'react', 'nextjs', 'sql', 'r'];
        return !nonExecutable.includes(lang.toLowerCase());
      });

      return {
        success: true,
        data: {
          languages: executableLanguages,
          count: executableLanguages.length
        }
      };
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        data: {
          languages: [],
          count: 0
        }
      };
    }
  }

  /**
   * Validate code syntax
   */
  async validateCode(request: ValidationRequest): Promise<ValidationResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/compiler/validate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        return {
          success: false,
          data: {
            isValid: false,
            errors: [errorData.error || 'Validation failed']
          }
        };
      }

      return await response.json();
    } catch (error) {
      console.error('API Error:', error);
      return {
        success: false,
        data: {
          isValid: false,
          errors: [error instanceof Error ? error.message : 'Network connection failed']
        }
      };
    }
  }

  /**
   * Check backend health
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/health`);
      return response.ok;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Check compiler service health
   */
  async checkCompilerHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/compiler/health`);
      const data = await response.json();
      return response.ok && data.success;
    } catch (error) {
      console.error('Compiler health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export utility functions
export const executeCode = (request: CodeExecutionRequest) => apiService.executeCode(request);
export const getSupportedLanguages = () => apiService.getLanguages();
export const validateCode = (request: ValidationRequest) => apiService.validateCode(request);
export const checkBackendHealth = () => apiService.checkHealth();
export const checkCompilerHealth = () => apiService.checkCompilerHealth();