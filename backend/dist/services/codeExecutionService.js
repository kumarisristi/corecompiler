"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeExecutionService = exports.CodeExecutionService = void 0;
const https_1 = __importDefault(require("https"));
const logger_1 = require("../utils/logger");
class CodeExecutionService {
    constructor() {
        this.RAPIDAPI_KEY = 'c1ca5df916msha636cb7af4c507cp16e40fjsn15ef7fba3e8a';
        this.RAPIDAPI_HOST = 'online-code-compiler.p.rapidapi.com';
        this.MAX_CODE_LENGTH = 50000;
        this.MAX_EXECUTION_TIME = 10000;
        this.DANGEROUS_PATTERNS = [
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
            /child_process\./i
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
        try {
            const securityCheck = this.validateCodeSecurity(request.code, request.language);
            if (!securityCheck.isValid) {
                return {
                    output: '',
                    error: `Security violation: ${securityCheck.reason}`,
                    executionTime: Date.now() - startTime,
                    memoryUsage: 0,
                    status: 'error'
                };
            }
            if (request.code.length > this.MAX_CODE_LENGTH) {
                return {
                    output: '',
                    error: `Code length exceeds limit of ${this.MAX_CODE_LENGTH} characters`,
                    executionTime: Date.now() - startTime,
                    memoryUsage: 0,
                    status: 'error'
                };
            }
            return await Promise.race([
                this.executeWithRapidAPI(request),
                this.createTimeoutPromise(this.MAX_EXECUTION_TIME)
            ]);
        }
        catch (error) {
            logger_1.logger.error('Code execution error:', error);
            return {
                output: '',
                error: `Execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                executionTime: Date.now() - startTime,
                memoryUsage: 0,
                status: 'error'
            };
        }
    }
    validateCodeSecurity(code, language) {
        for (const pattern of this.DANGEROUS_PATTERNS) {
            if (pattern.test(code)) {
                return {
                    isValid: false,
                    reason: `Code contains potentially dangerous pattern: ${pattern.source}`
                };
            }
        }
        switch (language.toLowerCase()) {
            case 'python':
                if (this.containsPythonMaliciousCode(code)) {
                    return { isValid: false, reason: 'Python code contains malicious patterns' };
                }
                break;
            case 'javascript':
                if (this.containsJSMaliciousCode(code)) {
                    return { isValid: false, reason: 'JavaScript code contains malicious patterns' };
                }
                break;
        }
        return { isValid: true };
    }
    containsPythonMaliciousCode(code) {
        const maliciousPatterns = [
            /import\s+os/i,
            /import\s+subprocess/i,
            /import\s+sys/i,
            /os\.system/i,
            /os\.popen/i,
            /subprocess\./i,
            /__import__/i
        ];
        return maliciousPatterns.some(pattern => pattern.test(code));
    }
    containsJSMaliciousCode(code) {
        const maliciousPatterns = [
            /import\s+fs/i,
            /import\s+path/i,
            /import\s+os/i,
            /require\s*\(\s*['"`]fs['"`]\s*\)/i,
            /require\s*\(\s*['"`]os['"`]\s*\)/i,
            /require\s*\(\s*['"`]child_process['"`]\s*\)/i,
            /fs\./i,
            /child_process\./i,
            /process\./i
        ];
        return maliciousPatterns.some(pattern => pattern.test(code));
    }
    async executeWithRapidAPI(request) {
        return new Promise((resolve) => {
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
                    const body = Buffer.concat(chunks);
                    try {
                        const response = JSON.parse(body.toString());
                        resolve({
                            output: response.output || '',
                            error: response.error || null,
                            executionTime: Date.now() - (Date.now() - 0),
                            memoryUsage: 0,
                            status: response.error ? 'error' : 'success'
                        });
                    }
                    catch (parseError) {
                        resolve({
                            output: '',
                            error: `API response parsing failed: ${parseError}`,
                            executionTime: 0,
                            memoryUsage: 0,
                            status: 'error'
                        });
                    }
                });
            });
            req.on('error', (error) => {
                resolve({
                    output: '',
                    error: `Request failed: ${error.message}`,
                    executionTime: 0,
                    memoryUsage: 0,
                    status: 'error'
                });
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
exports.CodeExecutionService = CodeExecutionService;
exports.codeExecutionService = new CodeExecutionService();
//# sourceMappingURL=codeExecutionService.js.map