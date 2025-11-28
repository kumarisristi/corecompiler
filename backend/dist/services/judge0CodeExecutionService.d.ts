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
export declare class Judge0CodeExecutionService {
    private readonly BASE_URL;
    private readonly DEFAULT_TIMEOUT;
    private readonly MAX_CODE_SIZE;
    private readonly MAX_OUTPUT_SIZE;
    private readonly LANGUAGE_MAP;
    executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse>;
    private simplifyCode;
    private submitCode;
    private waitForResult;
    private mapStatus;
    getSupportedLanguages(): string[];
    isLanguageSupported(language: string): boolean;
    validateSyntax(code: string, language: string): {
        isValid: boolean;
        errors: string[];
    };
    private hasUnclosedBraces;
    private hasUnclosedParentheses;
    private hasMismatchedIndentation;
}
export declare const judge0CodeExecutionService: Judge0CodeExecutionService;
//# sourceMappingURL=judge0CodeExecutionService.d.ts.map