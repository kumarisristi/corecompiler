"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const judge0CodeExecutionService_1 = require("../services/judge0CodeExecutionService");
const alternativeCodeExecutionService_1 = require("../services/alternativeCodeExecutionService");
const directCppExecutionService_1 = require("../services/directCppExecutionService");
const logger_1 = require("../utils/logger");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = express_1.default.Router();
const executionLimiter = (0, express_rate_limit_1.default)({
    windowMs: 60 * 1000,
    max: 10,
    message: {
        error: 'Too many code execution requests, please try again later.',
        retryAfter: '60 seconds'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
router.use('/execute', executionLimiter);
router.post('/execute', async (req, res) => {
    try {
        const { language, code, input, timeLimit } = req.body;
        if (!language || typeof language !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Language is required and must be a string'
            });
        }
        if (!code || typeof code !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Code is required and must be a string'
            });
        }
        if (!judge0CodeExecutionService_1.judge0CodeExecutionService.isLanguageSupported(language) && !directCppExecutionService_1.directCppExecutionService.isLanguageSupported(language)) {
            return res.status(400).json({
                success: false,
                error: `Unsupported language: ${language}. Supported languages: ${[...judge0CodeExecutionService_1.judge0CodeExecutionService.getSupportedLanguages(), ...directCppExecutionService_1.directCppExecutionService.getSupportedLanguages()].join(', ')}`
            });
        }
        logger_1.logger.info(`[COMPILER] Code execution requested`, {
            language,
            codeLength: code ? code.length : 0,
            hasInput: !!input,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });
        let result;
        if (directCppExecutionService_1.directCppExecutionService.isLanguageSupported(language)) {
            const codeLower = code.toLowerCase();
            if (codeLower.includes('star pattern') && codeLower.includes('for') && codeLower.includes('*')) {
                logger_1.logger.info('[COMPILER] Using direct C++ execution service for star pattern');
                result = await directCppExecutionService_1.directCppExecutionService.executeCode({
                    language,
                    code,
                    input,
                    timeLimit
                });
            }
            else {
                logger_1.logger.info('[COMPILER] Using Judge0 execution service for C++');
                result = await judge0CodeExecutionService_1.judge0CodeExecutionService.executeCode({
                    language,
                    code,
                    input,
                    timeLimit
                });
            }
        }
        else {
            logger_1.logger.info('[COMPILER] Using Judge0 execution service');
            result = await judge0CodeExecutionService_1.judge0CodeExecutionService.executeCode({
                language,
                code,
                input,
                timeLimit
            });
        }
        if (result.status === 'file_size_limit_exceeded' && alternativeCodeExecutionService_1.alternativeCodeExecutionService.isLanguageSupported(language)) {
            logger_1.logger.warn(`[COMPILER] Judge0 failed with file size limit, trying alternative service for ${language}`);
            result = await alternativeCodeExecutionService_1.alternativeCodeExecutionService.executeCode({
                language,
                code,
                input,
                timeLimit
            });
            result.error = result.error ? `[FALLBACK] ${result.error}` : '[FALLBACK] Executed using alternative service';
        }
        logger_1.logger.info(`[COMPILER] Code execution completed`, {
            language,
            status: result.status,
            executionTime: result.executionTime,
            hasError: !!result.error,
            ip: req.ip
        });
        res.json({
            success: true,
            data: {
                output: result.output,
                error: result.error,
                executionTime: result.executionTime,
                memoryUsage: result.memoryUsage,
                status: result.status
            }
        });
    }
    catch (error) {
        logger_1.logger.error('[COMPILER] Execution route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during code execution',
            message: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : 'Something went wrong'
        });
    }
});
router.get('/languages', (req, res) => {
    try {
        const languages = judge0CodeExecutionService_1.judge0CodeExecutionService.getSupportedLanguages();
        res.json({
            success: true,
            data: {
                languages,
                count: languages.length
            }
        });
    }
    catch (error) {
        logger_1.logger.error('[COMPILER] Languages route error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch supported languages'
        });
    }
});
router.post('/validate', async (req, res) => {
    try {
        const { code, language } = req.body;
        if (!code || typeof code !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Code is required and must be a string'
            });
        }
        if (!language || typeof language !== 'string') {
            return res.status(400).json({
                success: false,
                error: 'Language is required and must be a string'
            });
        }
        const validation = {
            isValid: true,
            errors: []
        };
        res.json({
            success: true,
            data: validation
        });
    }
    catch (error) {
        logger_1.logger.error('[COMPILER] Validation route error:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error during validation'
        });
    }
});
router.get('/health', async (req, res) => {
    try {
        const startTime = Date.now();
        const testResult = await judge0CodeExecutionService_1.judge0CodeExecutionService.executeCode({
            language: 'python',
            code: 'print("Health check passed")',
            timeLimit: 5000
        });
        const responseTime = Date.now() - startTime;
        res.json({
            success: true,
            data: {
                status: 'healthy',
                responseTime,
                testExecution: {
                    status: testResult.status,
                    hasOutput: !!testResult.output,
                    executionTime: testResult.executionTime
                },
                timestamp: new Date().toISOString()
            }
        });
    }
    catch (error) {
        logger_1.logger.error('[COMPILER] Health check failed:', error);
        res.status(503).json({
            success: false,
            error: 'Code execution service is unhealthy',
            timestamp: new Date().toISOString()
        });
    }
});
router.get('/stats', (req, res) => {
    res.json({
        success: true,
        data: {
            supportedLanguages: judge0CodeExecutionService_1.judge0CodeExecutionService.getSupportedLanguages().length,
            uptime: process.uptime(),
            memoryUsage: process.memoryUsage(),
            nodeVersion: process.version
        }
    });
});
exports.default = router;
//# sourceMappingURL=compiler.js.map