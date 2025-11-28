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
export declare class AlternativeCodeExecutionService {
    private readonly SIMULATED_EXECUTION_TIME;
    private readonly SAFE_PATTERNS;
    executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse>;
    private isCodeSafe;
    private simulateExecution;
    private simulatePython;
    private simulateJavaScript;
    private simulateCpp;
    private simulateJava;
    getSupportedLanguages(): string[];
    isLanguageSupported(language: string): boolean;
}
export declare const alternativeCodeExecutionService: AlternativeCodeExecutionService;
//# sourceMappingURL=alternativeCodeExecutionService.d.ts.map