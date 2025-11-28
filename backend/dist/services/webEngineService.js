"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webEngineService = exports.WebEngineService = void 0;
const puppeteer_1 = __importDefault(require("puppeteer"));
const logger_1 = require("../utils/logger");
class WebEngineService {
    constructor() {
        this.browser = null;
        this.DEFAULT_TIMEOUT = 30000;
        this.DEFAULT_VIEWPORT = { width: 1200, height: 800 };
        this.initializeBrowser();
    }
    async initializeBrowser() {
        try {
            logger_1.logger.info('[WEB_ENGINE] Initializing headless Chrome browser...');
            this.browser = await puppeteer_1.default.launch({
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
            logger_1.logger.info('[WEB_ENGINE] Browser initialized successfully');
        }
        catch (error) {
            logger_1.logger.error('[WEB_ENGINE] Failed to initialize browser:', error);
            throw error;
        }
    }
    async executeWebCode(request) {
        const startTime = Date.now();
        if (!this.browser) {
            await this.initializeBrowser();
        }
        let page = null;
        try {
            logger_1.logger.info('[WEB_ENGINE] Starting web code execution', {
                hasHtml: !!request.html,
                hasCss: !!request.css,
                hasJavaScript: !!request.javascript,
                hasUrl: !!request.url
            });
            page = await this.browser.newPage();
            await page.setViewport({
                width: request.viewport?.width || this.DEFAULT_VIEWPORT.width,
                height: request.viewport?.height || this.DEFAULT_VIEWPORT.height
            });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            let result;
            if (request.url) {
                result = await this.executeUrl(page, request);
            }
            else {
                result = await this.executeHtmlCode(page, request);
            }
            result.executionTime = Date.now() - startTime;
            return result;
        }
        catch (error) {
            logger_1.logger.error('[WEB_ENGINE] Execution error:', error);
            return {
                success: false,
                error: `Web execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                executionTime: Date.now() - startTime
            };
        }
        finally {
            if (page) {
                await page.close();
            }
        }
    }
    async executeHtmlCode(page, request) {
        try {
            const html = this.createCompleteHtml(request);
            await page.setContent(html, {
                waitUntil: 'networkidle0',
                timeout: request.timeout || this.DEFAULT_TIMEOUT
            });
            await page.waitForTimeout(2000);
            const screenshot = await page.screenshot({
                type: 'png',
                fullPage: true,
                quality: 80
            });
            const finalHtml = await page.content();
            return {
                success: true,
                screenshot: `data:image/png;base64,${screenshot.toString('base64')}`,
                html: finalHtml,
                url: page.url()
            };
        }
        catch (error) {
            return {
                success: false,
                error: `HTML execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                executionTime: 0
            };
        }
    }
    async executeUrl(page, request) {
        try {
            await page.goto(request.url, {
                waitUntil: 'networkidle0',
                timeout: request.timeout || this.DEFAULT_TIMEOUT
            });
            await page.waitForTimeout(2000);
            const screenshot = await page.screenshot({
                type: 'png',
                fullPage: true,
                quality: 80
            });
            const finalHtml = await page.content();
            return {
                success: true,
                screenshot: `data:image/png;base64,${screenshot.toString('base64')}`,
                html: finalHtml,
                url: request.url
            };
        }
        catch (error) {
            return {
                success: false,
                error: `URL execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                executionTime: 0
            };
        }
    }
    createCompleteHtml(request) {
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
    getSupportedTechnologies() {
        return ['html', 'css', 'javascript', 'url'];
    }
    isTechnologySupported(technology) {
        return this.getSupportedTechnologies().includes(technology.toLowerCase());
    }
    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            logger_1.logger.info('[WEB_ENGINE] Browser closed');
        }
    }
}
exports.WebEngineService = WebEngineService;
exports.webEngineService = new WebEngineService();
//# sourceMappingURL=webEngineService.js.map