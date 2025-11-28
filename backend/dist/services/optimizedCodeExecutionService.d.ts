export interface CodeExecutionRequest {
    language: string;
    code: string;
    input?: string;
    timeLimit?: number;
    mode?: 'simple' | 'secure';
}
export interface CodeExecutionResponse {
    output: string;
    error: string | null;
    executionTime: number;
    memoryUsage?: number;
    status: 'success' | 'error' | 'timeout' | 'memory_limit_exceeded' | 'file_size_limit_exceeded';
}
export declare class OptimizedCodeExecutionService {
    private readonly RAPIDAPI_KEY;
    private readonly RAPIDAPI_HOST;
    private readonly DEFAULT_TIMEOUT;
    private readonly BASIC_DANGERS;
    private readonly COMPREHENSIVE_DANGERS;
    private readonly LANGUAGE_MAP;
    executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse>;
    private validateCodeSecurity;
    private executeWithRapidAPI;
    private createTimeoutPromise;
    getSupportedLanguages(): string[];
    isLanguageSupported(language: string): boolean;
}
export declare const optimizedCodeExecutionService: OptimizedCodeExecutionService;
//# sourceMappingURL=optimizedCodeExecutionService.d.ts.map