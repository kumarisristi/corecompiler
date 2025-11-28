export interface WebCodeExecutionRequest {
    html?: string;
    css?: string;
    javascript?: string;
    url?: string;
    viewport?: {
        width: number;
        height: number;
    };
    timeout?: number;
}
export interface WebCodeExecutionResponse {
    success: boolean;
    screenshot?: string;
    html?: string;
    error?: string;
    executionTime: number;
    url?: string;
}
export declare class WebEngineService {
    private browser;
    private readonly DEFAULT_TIMEOUT;
    private readonly DEFAULT_VIEWPORT;
    constructor();
    private initializeBrowser;
    executeWebCode(request: WebCodeExecutionRequest): Promise<WebCodeExecutionResponse>;
    private executeHtmlCode;
    private executeUrl;
    private createCompleteHtml;
    getSupportedTechnologies(): string[];
    isTechnologySupported(technology: string): boolean;
    cleanup(): Promise<void>;
}
export declare const webEngineService: WebEngineService;
//# sourceMappingURL=webEngineService.d.ts.map