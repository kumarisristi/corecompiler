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
export declare class MockCodeExecutionService {
    private readonly DEFAULT_TIMEOUT;
    private readonly DEFAULT_MEMORY;
    private readonly LANGUAGE_MAP;
    executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse>;
    private simulateExecutionTime;
    private calculateMemoryUsage;
    private generateMockOutput;
    private generateMockError;
    getSupportedLanguages(): string[];
    isLanguageSupported(language: string): boolean;
    validateSyntax(code: string, language: string): {
        isValid: boolean;
        errors: string[];
    };
}
export declare const mockCodeExecutionService: MockCodeExecutionService;
//# sourceMappingURL=mockCodeExecutionService.d.ts.map