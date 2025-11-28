"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const webEngineService_1 = require("../services/webEngineService");
const logger_1 = require("../utils/logger");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = express_1.default.Router();
const webEngineLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 20,
    message: {
        error: 'Too many web execution requests, please try again later.',
        retryAfter: '60 seconds'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
router.use('/web', webEngineLimiter);
router.post('/execute', async (req, res) => {
    try {
        const { html, css, javascript, url, viewport, timeout } = req.body;
        if (!html && !css && !javascript && !url) {
            return res.status(400).json({
                success: false,
                error: 'At least one of html, css, javascript, or url is required'
            });
        }
        if (url && (!html && !css && !javascript)) {
            if (!webEngineService_1.webEngineService.isTechnologySupported('url')) {
                return res.status(400).json({
                    success: false,
                    error: 'URL execution not supported'
                });
            }
        }
        logger_1.logger.info('[WEB_ENGINE] Web execution requested', {
            hasHtml: !!html,
            hasCss: !!css,
            hasJavaScript: !!javascript,
            hasUrl: !!url,
            codeLengths: {
                html: html?.length || 0,
                css: css?.length || 0,
                javascript: javascript?.length || 0
            },
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        const result = await webEngineService_1.webEngineService.executeWebCode({
            html,
            css,
            javascript,
            url,
            viewport,
            timeout
        });
        logger_1.logger.info('[WEB_ENGINE] Web execution completed', {
            success: result.success,
            executionTime: result.executionTime,
            hasScreenshot: !!result.screenshot,
            hasHtml: !!result.html,
            hasError: !!result.error,
            ip: req.ip
        });
        res.json({
            success: true,
            data: result
        });
    }
    catch (error) {
        logger_1.logger.error('[WEB_ENGINE] Web execution route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during web execution',
            message: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : 'Something went wrong'
        });
    }
});
router.get('/technologies', (req, res) => {
    try {
        const technologies = webEngineService_1.webEngineService.getSupportedTechnologies();
        res.json({
            success: true,
            data: {
                technologies,
                count: technologies.length
            }
        });
    }
    catch (error) {
        logger_1.logger.error('[WEB_ENGINE] Technologies route error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch supported technologies'
        });
    }
});
router.get('/health', async (req, res) => {
    try {
        const startTime = Date.now();
        const testResult = await webEngineService_1.webEngineService.executeWebCode({
            html: '<h1 style="color: blue;">Web Engine Health Check</h1><p>Success!</p>',
            css: 'body { font-family: Arial, sans-serif; margin: 40px; }',
            javascript: 'console.log("Health check executed");',
            timeout: 10000
        });
        const responseTime = Date.now() - startTime;
        res.json({
            success: true,
            data: {
                status: testResult.success ? 'healthy' : 'unhealthy',
                responseTime,
                testExecution: {
                    success: testResult.success,
                    hasScreenshot: !!testResult.screenshot,
                    executionTime: testResult.executionTime,
                    error: testResult.error
                },
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
        logger_1.logger.error('[WEB_ENGINE] Health check failed:', error);
        res.status(503).json({
            success: false,
            error: 'Web engine service is unhealthy',
            timestamp: new Date().toISOString()
        });
    }
});
router.get('/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            supportedTechnologies: webEngineService_1.webEngineService.getSupportedTechnologies().length,
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            nodeVersion: process.version
        }
    });
});
exports.default = router;
//# sourceMappingURL=webEngine.js.map