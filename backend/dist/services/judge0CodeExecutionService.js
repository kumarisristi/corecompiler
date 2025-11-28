"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.judge0CodeExecutionService = exports.Judge0CodeExecutionService = void 0;
const https_1 = __importDefault(require("https"));
const logger_1 = require("../utils/logger");
class Judge0CodeExecutionService {
    constructor() {
        this.BASE_URL = 'https://ce.judge0.com';
        this.DEFAULT_TIMEOUT = 10000;
        this.MAX_CODE_SIZE = 100000;
        this.MAX_OUTPUT_SIZE = 50000;
        this.LANGUAGE_MAP = {
            'javascript': 63,
            'python': 71,
            'java': 62,
            'cpp': 54,
            'c': 50,
            'go': 60,
            'rust': 73,
            'php': 68,
            'ruby': 72,
            'swift': 83,
            'kotlin': 78,
            'typescript': 74
        };
    }
    async executeCode(request) {
        const startTime = Date.now();
        try {
            if (request.code.length > this.MAX_CODE_SIZE) {
                return {
                    output: '',
                    error: `Code size exceeds limit of ${this.MAX_CODE_SIZE} characters`,
                    executionTime: Date.now() - startTime,
                    memoryUsage: 0,
                    status: 'error'
                };
            }
            const languageId = this.LANGUAGE_MAP[request.language];
            if (!languageId) {
                return {
                    output: '',
                    error: `Unsupported language: ${request.language}`,
                    executionTime: Date.now() - startTime,
                    memoryUsage: 0,
                    status: 'error'
                };
            }
            const maxRetries = 2;
            let lastError = null;
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                try {
                    logger_1.logger.info(`[COMPILER] Attempt ${attempt} execution for ${request.language}`, {
                        codeLength: request.code.length,
                        hasInput: !!request.input
                    });
                    const submissionResponse = await this.submitCode({
                        language_id: languageId,
                        source_code: attempt > 1 ? this.simplifyCode(request.code) : request.code,
                        stdin: request.input || ''
                    });
                    if (!submissionResponse.token) {
                        lastError = new Error('Failed to get submission token');
                        continue;
                    }
                    const timeout = request.timeLimit || this.DEFAULT_TIMEOUT;
                    const result = await this.waitForResult(submissionResponse.token, timeout);
                    const status = this.mapStatus(result.status?.id);
                    let output = result.stdout || '';
                    if (output.length > this.MAX_OUTPUT_SIZE) {
                        output = output.substring(0, this.MAX_OUTPUT_SIZE) + '\n\n[Output truncated due to size limits]';
                    }
                    if (status === 'file_size_limit_exceeded') {
                        if (attempt < maxRetries) {
                            logger_1.logger.warn(`[COMPILER] File size limit error, retrying with simplified code (attempt ${attempt})`);
                            continue;
                        }
                        else {
                            return {
                                output: '',
                                error: 'File size limit exceeded. Your code may be too complex for the current execution environment. Try simplifying your logic or using a simpler approach.',
                                executionTime: Date.now() - startTime,
                                memoryUsage: result.memory || 0,
                                status
                            };
                        }
                    }
                    if (status === 'error' && result.compile_output) {
                        const compileError = result.compile_output.toLowerCase();
                        if (compileError.includes('file size limit') || compileError.includes('core dumped')) {
                            if (attempt < maxRetries) {
                                logger_1.logger.warn(`[COMPILER] Compilation file size error, retrying (attempt ${attempt})`);
                                continue;
                            }
                        }
                    }
                    return {
                        output,
                        error: result.stderr || result.compile_output || null,
                        executionTime: Date.now() - startTime,
                        memoryUsage: result.memory || 0,
                        status
                    };
                }
                catch (attemptError) {
                    lastError = attemptError;
                    logger_1.logger.error(`[COMPILER] Execution attempt ${attempt} failed:`, attemptError);
                    if (attempt === maxRetries)
                        break;
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                }
            }
            throw lastError || new Error('All execution attempts failed');
        }
        catch (error) {
            logger_1.logger.error('Judge0 execution error:', error);
            if (error instanceof Error) {
                const errorMessage = error.message.toLowerCase();
                if (errorMessage.includes('file size limit') || errorMessage.includes('core dumped')) {
                    return {
                        output: '',
                        error: 'File size limit exceeded. The compiled program is too large for the execution environment. Please simplify your code or reduce its complexity.',
                        executionTime: Date.now() - startTime,
                        memoryUsage: 0,
                        status: 'file_size_limit_exceeded'
                    };
                }
            }
            return {
                output: '',
                error: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}. Please try simplifying your code or check your syntax.`,
                executionTime: Date.now() - startTime,
                memoryUsage: 0,
                status: 'error'
            };
        }
    }
    simplifyCode(code) {
        const lines = code.split('\n');
        const simplifiedLines = lines.filter(line => {
            const trimmed = line.trim();
            return !trimmed.startsWith('//') && !trimmed.startsWith('/*') && !trimmed.endsWith('*/');
        });
        return simplifiedLines.join('\n');
    }
    submitCode(data) {
        return new Promise((resolve, reject) => {
            const postData = JSON.stringify(data);
            const options = {
                method: 'POST',
                hostname: 'ce.judge0.com',
                port: 443,
                path: '/submissions/?base64_encoded=false&wait=false',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };
            const req = https_1.default.request(options, (res) => {
                const chunks = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => {
                    try {
                        const body = Buffer.concat(chunks);
                        const response = JSON.parse(body.toString());
                        resolve(response);
                    }
                    catch (parseError) {
                        reject(new Error('Failed to parse submission response'));
                    }
                });
            });
            req.on('error', (error) => {
                reject(new Error(`Submission request failed: ${error.message}`));
            });
            req.write(postData);
            req.end();
        });
    }
    waitForResult(token, timeout) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkResult = () => {
                const elapsed = Date.now() - startTime;
                if (elapsed >= timeout) {
                    reject(new Error(`Execution timeout after ${timeout}ms`));
                    return;
                }
                const options = {
                    method: 'GET',
                    hostname: 'ce.judge0.com',
                    port: 443,
                    path: `/submissions/${token}?base64_encoded=false`,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };
                const req = https_1.default.request(options, (res) => {
                    const chunks = [];
                    res.on('data', (chunk) => chunks.push(chunk));
                    res.on('end', () => {
                        try {
                            const body = Buffer.concat(chunks);
                            const result = JSON.parse(body.toString());
                            if (result.status && result.status.id >= 3) {
                                resolve(result);
                            }
                            else {
                                setTimeout(checkResult, 1000);
                            }
                        }
                        catch (parseError) {
                            reject(new Error('Failed to parse result response'));
                        }
                    });
                });
                req.on('error', (error) => {
                    reject(new Error(`Result request failed: ${error.message}`));
                });
                req.end();
            };
            checkResult();
        });
    }
    mapStatus(judge0StatusId) {
        if (!judge0StatusId)
            return 'error';
        switch (judge0StatusId) {
            case 3: return 'success';
            case 5: return 'timeout';
            case 8: return 'file_size_limit_exceeded';
            case 7: return 'memory_limit_exceeded';
            case 6: return 'error';
            case 9:
            case 10:
            case 11:
            case 12: return 'error';
            default: return 'error';
        }
    }
    getSupportedLanguages() {
        return Object.keys(this.LANGUAGE_MAP);
    }
    isLanguageSupported(language) {
        return language.toLowerCase() in this.LANGUAGE_MAP;
    }
    validateSyntax(code, language) {
        const errors = [];
        switch (language.toLowerCase()) {
            case 'javascript':
            case 'typescript':
                if (this.hasUnclosedBraces(code)) {
                    errors.push('Unclosed braces detected');
                }
                if (this.hasUnclosedParentheses(code)) {
                    errors.push('Unclosed parentheses detected');
                }
                break;
            case 'python':
                if (this.hasMismatchedIndentation(code)) {
                    errors.push('Indentation error detected');
                }
                break;
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    hasUnclosedBraces(code) {
        let braceCount = 0;
        for (const char of code) {
            if (char === '{')
                braceCount++;
            if (char === '}')
                braceCount--;
            if (braceCount < 0)
                break;
        }
        return braceCount !== 0;
    }
    hasUnclosedParentheses(code) {
        let parenCount = 0;
        for (const char of code) {
            if (char === '(')
                parenCount++;
            if (char === ')')
                parenCount--;
            if (parenCount < 0)
                break;
        }
        return parenCount !== 0;
    }
    hasMismatchedIndentation(code) {
        const lines = code.split('\n');
        let expectedIndent = 0;
        for (const line of lines) {
            if (line.trim() === '')
                continue;
            const actualIndent = line.match(/^\s*/)?.[0].length || 0;
            if (actualIndent % 4 !== 0 && actualIndent !== 0) {
                return true;
            }
        }
        return false;
    }
}
exports.Judge0CodeExecutionService = Judge0CodeExecutionService;
exports.judge0CodeExecutionService = new Judge0CodeExecutionService();
//# sourceMappingURL=judge0CodeExecutionService.js.map