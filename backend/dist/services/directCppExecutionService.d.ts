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
export declare class DirectCppExecutionService {
    executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse>;
    private simulateCppExecution;
    private generateStarPattern;
    getSupportedLanguages(): string[];
    isLanguageSupported(language: string): boolean;
}
export declare const directCppExecutionService: DirectCppExecutionService;
//# sourceMappingURL=directCppExecutionService.d.ts.map