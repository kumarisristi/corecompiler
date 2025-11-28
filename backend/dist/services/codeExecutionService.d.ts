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
export declare class CodeExecutionService {
    private readonly RAPIDAPI_KEY;
    private readonly RAPIDAPI_HOST;
    private readonly MAX_CODE_LENGTH;
    private readonly MAX_EXECUTION_TIME;
    private readonly DANGEROUS_PATTERNS;
    private readonly LANGUAGE_MAP;
    executeCode(request: CodeExecutionRequest): Promise<CodeExecutionResponse>;
    private validateCodeSecurity;
    private containsPythonMaliciousCode;
    private containsJSMaliciousCode;
    private executeWithRapidAPI;
    private createTimeoutPromise;
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
export declare const codeExecutionService: CodeExecutionService;
//# sourceMappingURL=codeExecutionService.d.ts.map