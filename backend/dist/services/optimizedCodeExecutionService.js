"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.optimizedCodeExecutionService = exports.OptimizedCodeExecutionService = void 0;
const https_1 = __importDefault(require("https"));
const logger_1 = require("../utils/logger");
class OptimizedCodeExecutionService {
    constructor() {
        this.RAPIDAPI_KEY = process.env.RAPIDAPI_KEY || '';
        this.RAPIDAPI_HOST = 'online-code-compiler.p.rapidapi.com';
        this.DEFAULT_TIMEOUT = 10000;
        this.BASIC_DANGERS = [
            /require\s*\(\s*['"`]fs['"`]\s*\)/i,
            /require\s*\(\s*['"`]child_process['"`]\s*\)/i,
            /eval\s*\(/i
        ];
        this.COMPREHENSIVE_DANGERS = [
            /while\s*\(\s*true\s*\)/i,
            /for\s*\(\s*;;\s*\)/i,
            /eval\s*\(/i,
            /Function\s*\(/i,
            /require\s*\(\s*['"`]fs['"`]\s*\)/i,
            /require\s*\(\s*['"`]child_process['"`]\s*\)/i,
            /import\s+fs/i,
            /import\s+child_process/i,
            /process\.exit/i,
            /process\.kill/i,
            /__dirname/i,
            /__filename/i,
            /fs\./i,
            /child_process\./i,
            /__import__/i,
            /import\s+os/i,
            /import\s+subprocess/i,
            /import\s+sys/i,
            /os\.system/i,
            /os\.popen/i,
            /subprocess\./i
        ];
        this.LANGUAGE_MAP = {
            'javascript': 'nodejs',
            'python': 'python3',
            'java': 'java',
            'cpp': 'cpp',
            'c': 'c',
            'go': 'go',
            'rust': 'rust',
            'php': 'php',
            'ruby': 'ruby',
            'swift': 'swift',
            'kotlin': 'kotlin'
        };
    }
    async executeCode(request) {
        const startTime = Date.now();
        const mode = request.mode || 'secure';
        try {
            const securityLevel = mode === 'simple' ? this.BASIC_DANGERS : this.COMPREHENSIVE_DANGERS;
            this.validateCodeSecurity(request.code, securityLevel);
            const timeout = Math.min(request.timeLimit || this.DEFAULT_TIMEOUT, 30000);
            const result = await Promise.race([
                this.executeWithRapidAPI(request),
                this.createTimeoutPromise(timeout)
            ]);
            return {
                ...result,
                executionTime: Date.now() - startTime
            };
        }
        catch (error) {
            logger_1.logger.error('Code execution error:', error);
            return {
                output: '',
                error: error instanceof Error ? error.message : 'Unknown error',
                executionTime: Date.now() - startTime,
                status: 'error'
            };
        }
    }
    validateCodeSecurity(code, patterns) {
        for (const pattern of patterns) {
            if (pattern.test(code)) {
                throw new Error(`Security violation: potentially dangerous pattern detected`);
            }
        }
    }
    async executeWithRapidAPI(request) {
        return new Promise((resolve, reject) => {
            const apiLanguage = this.LANGUAGE_MAP[request.language] || request.language;
            const postData = JSON.stringify({
                language: apiLanguage,
                version: 'latest',
                code: request.code,
                input: request.input || null
            });
            const options = {
                method: 'POST',
                hostname: this.RAPIDAPI_HOST,
                port: null,
                path: '/v1/',
                headers: {
                    'x-rapidapi-key': this.RAPIDAPI_KEY,
                    'x-rapidapi-host': this.RAPIDAPI_HOST,
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };
            const req = https_1.default.request(options, (res) => {
                const chunks = [];
                res.on('data', (chunk) => {
                    chunks.push(chunk);
                });
                res.on('end', () => {
                    try {
                        const body = Buffer.concat(chunks);
                        const response = JSON.parse(body.toString());
                        resolve({
                            output: response.output || '',
                            error: response.error || null,
                            executionTime: 0,
                            memoryUsage: 0,
                            status: response.error ? 'error' : 'success'
                        });
                    }
                    catch (parseError) {
                        reject(new Error(`API response parsing failed: ${parseError}`));
                    }
                });
            });
            req.on('error', (error) => {
                reject(new Error(`Request failed: ${error.message}`));
            });
            req.write(postData);
            req.end();
        });
    }
    createTimeoutPromise(timeoutMs) {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    output: '',
                    error: `Execution timeout after ${timeoutMs}ms`,
                    executionTime: timeoutMs,
                    memoryUsage: 0,
                    status: 'timeout'
                });
            }, timeoutMs);
        });
    }
    getSupportedLanguages() {
        return Object.keys(this.LANGUAGE_MAP);
    }
    isLanguageSupported(language) {
        return language.toLowerCase() in this.LANGUAGE_MAP;
    }
}
exports.OptimizedCodeExecutionService = OptimizedCodeExecutionService;
exports.optimizedCodeExecutionService = new OptimizedCodeExecutionService();
//# sourceMappingURL=optimizedCodeExecutionService.js.map