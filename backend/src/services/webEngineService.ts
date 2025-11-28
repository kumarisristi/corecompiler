import puppeteer, { Browser, Page } from 'puppeteer';
import { logger } from '../utils/logger';

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

export class WebEngineService {
  private browser: Browser | null = null;
  private readonly DEFAULT_TIMEOUT = 30000;
  private readonly DEFAULT_VIEWPORT = { width: 1200, height: 800 };

  constructor() {
    this.initializeBrowser();
  }

  /**
   * Initialize headless Chrome browser
   */
  private async initializeBrowser(): Promise<void> {
    try {
      logger.info('[WEB_ENGINE] Initializing headless Chrome browser...');
      
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--single-process',
          '--disable-gpu'
        ]
      });

      logger.info('[WEB_ENGINE] Browser initialized successfully');
    } catch (error) {
      logger.error('[WEB_ENGINE] Failed to initialize browser:', error);
      throw error;
    }
  }

  /**
   * Execute HTML/CSS/JavaScript code in headless browser
   */
  async executeWebCode(request: WebCodeExecutionRequest): Promise<WebCodeExecutionResponse> {
    const startTime = Date.now();
    
    if (!this.browser) {
      await this.initializeBrowser();
    }

    let page: Page | null = null;

    try {
      logger.info('[WEB_ENGINE] Starting web code execution', {
        hasHtml: !!request.html,
        hasCss: !!request.css,
        hasJavaScript: !!request.javascript,
        hasUrl: !!request.url
      });

      page = await this.browser!.newPage();
      
      // Set viewport
      await page.setViewport({
        width: request.viewport?.width || this.DEFAULT_VIEWPORT.width,
        height: request.viewport?.height || this.DEFAULT_VIEWPORT.height
      });

      // Set user agent to avoid blocking
      await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

      let result: WebCodeExecutionResponse;

      if (request.url) {
        // Execute URL
        result = await this.executeUrl(page, request);
      } else {
        // Execute HTML/CSS/JS code
        result = await this.executeHtmlCode(page, request);
      }

      result.executionTime = Date.now() - startTime;
      return result;

    } catch (error) {
      logger.error('[WEB_ENGINE] Execution error:', error);
      return {
        success: false,
        error: `Web execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: Date.now() - startTime
      };
    } finally {
      if (page) {
        await page.close();
      }
    }
  }

  /**
   * Execute HTML/CSS/JavaScript code
   */
  private async executeHtmlCode(page: Page, request: WebCodeExecutionRequest): Promise<WebCodeExecutionResponse> {
    try {
      // Create complete HTML document
      const html = this.createCompleteHtml(request);
      
      // Set content
      await page.setContent(html, {
        waitUntil: 'networkidle0',
        timeout: request.timeout || this.DEFAULT_TIMEOUT
      });

      // Wait for any additional loading
      await page.waitForTimeout(2000);

      // Take screenshot
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: true,
        quality: 80
      });

      // Get final HTML
      const finalHtml = await page.content();

      return {
        success: true,
        screenshot: `data:image/png;base64,${screenshot.toString('base64')}`,
        html: finalHtml,
        url: page.url(),
        executionTime: 0 // Will be set by caller
      };

    } catch (error) {
      return {
        success: false,
        error: `HTML execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: 0
      };
    }
  }

  /**
   * Execute URL
   */
  private async executeUrl(page: Page, request: WebCodeExecutionRequest): Promise<WebCodeExecutionResponse> {
    try {
      // Navigate to URL
      await page.goto(request.url!, {
        waitUntil: 'networkidle0',
        timeout: request.timeout || this.DEFAULT_TIMEOUT
      });

      // Wait for page to load
      await page.waitForTimeout(2000);

      // Take screenshot
      const screenshot = await page.screenshot({
        type: 'png',
        fullPage: true,
        quality: 80
      });

      // Get final HTML
      const finalHtml = await page.content();

      return {
        success: true,
        screenshot: `data:image/png;base64,${screenshot.toString('base64')}`,
        html: finalHtml,
        url: request.url,
        executionTime: 0 // Will be set by caller
      };

    } catch (error) {
      return {
        success: false,
        error: `URL execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        executionTime: 0
      };
    }
  }

  /**
   * Create complete HTML document with embedded CSS and JavaScript
   */
  private createCompleteHtml(request: WebCodeExecutionRequest): string {
    const { html = '', css = '', javascript = '' } = request;

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Code Execution Result</title>
    <style>
        ${css}
    </style>
</head>
<body>
    ${html}
    
    <script>
        ${javascript}
    </script>
</body>
</html>`;
  }

  /**
   * Get supported web technologies
   */
  getSupportedTechnologies(): string[] {
    return ['html', 'css', 'javascript', 'url'];
  }

  /**
   * Check if technology is supported
   */
  isTechnologySupported(technology: string): boolean {
    return this.getSupportedTechnologies().includes(technology.toLowerCase());
  }

  /**
   * Cleanup resources
   */
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      logger.info('[WEB_ENGINE] Browser closed');
    }
  }
}

export const webEngineService = new WebEngineService();