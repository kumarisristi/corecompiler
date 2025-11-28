"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mockCodeExecutionService = exports.MockCodeExecutionService = void 0;
const logger_1 = require("../utils/logger");
class MockCodeExecutionService {
    constructor() {
        this.DEFAULT_TIMEOUT = 5000;
        this.DEFAULT_MEMORY = 10000;
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
            const executionTime = this.simulateExecutionTime(request.code);
            const memoryUsage = this.calculateMemoryUsage(request.code);
            const timeout = request.timeLimit || this.DEFAULT_TIMEOUT;
            if (executionTime > timeout) {
                return {
                    output: '',
                    error: `Execution timeout after ${timeout}ms`,
                    executionTime: timeout,
                    memoryUsage: 0,
                    status: 'timeout'
                };
            }
            const output = this.generateMockOutput(request.language, request.code);
            if (Math.random() < 0.05) {
                return {
                    output: '',
                    error: this.generateMockError(request.language, request.code),
                    executionTime: Date.now() - startTime,
                    memoryUsage: 0,
                    status: 'error'
                };
            }
            return {
                output,
                error: null,
                executionTime: Date.now() - startTime,
                memoryUsage,
                status: 'success'
            };
        }
        catch (error) {
            logger_1.logger.error('Mock execution error:', error);
            return {
                output: '',
                error: error instanceof Error ? error.message : 'Unknown error',
                executionTime: Date.now() - startTime,
                memoryUsage: 0,
                status: 'error'
            };
        }
    }
    simulateExecutionTime(code) {
        const baseTime = 100;
        const codeComplexity = code.length * 0.5;
        const randomDelay = Math.random() * 200;
        return Math.min(baseTime + codeComplexity + randomDelay, 1000);
    }
    calculateMemoryUsage(code) {
        const baseMemory = 1000;
        const codeMemory = code.length * 2;
        return Math.min(baseMemory + codeMemory, 50000);
    }
    generateMockOutput(language, code) {
        const normalizedLanguage = this.LANGUAGE_MAP[language] || language;
        if (normalizedLanguage === 'python3' || language === 'python') {
            if (code.includes('print(')) {
                const printMatches = code.match(/print\(['"]([^'"]*)['"]\)/g);
                if (printMatches) {
                    return printMatches
                        .map(match => match.match(/print\(['"]([^'"]*)['"]\)/)?.[1] || '')
                        .filter(output => output)
                        .join('\n');
                }
            }
            if (code.includes('input(')) {
                return 'Mock input processed';
            }
            if (code.includes('=')) {
                return 'Variables created and computed successfully';
            }
            return 'Python code executed successfully\nNo specific output generated';
        }
        if (normalizedLanguage === 'nodejs' || language === 'javascript') {
            if (code.includes('console.log(')) {
                const logMatches = code.match(/console\.log\(['"]([^'"]*)['"]\)/g);
                if (logMatches) {
                    return logMatches
                        .map(match => match.match(/console\.log\(['"]([^'"]*)['"]\)/)?.[1] || '')
                        .filter(output => output)
                        .join('\n');
                }
            }
            if (code.includes('console.log')) {
                return 'JavaScript executed successfully';
            }
            return 'Node.js code executed successfully';
        }
        return `${normalizedLanguage} code executed successfully\nExecution completed without errors\nMemory used: ${this.calculateMemoryUsage(code)} bytes`;
    }
    generateMockError(language, code) {
        const errors = [
            'Runtime Error: Undefined variable',
            'Syntax Error: Unexpected token',
            'Runtime Error: Division by zero',
            'Memory Error: Out of memory',
            'Timeout Error: Code took too long',
            'Runtime Error: Null reference exception',
            'Syntax Error: Missing semicolon',
            'Runtime Error: Array index out of bounds'
        ];
        return errors[Math.floor(Math.random() * errors.length)] || 'Mock execution error';
    }
    getSupportedLanguages() {
        return Object.keys(this.LANGUAGE_MAP);
    }
    isLanguageSupported(language) {
        return language.toLowerCase() in this.LANGUAGE_MAP;
    }
    validateSyntax(code, language) {
        const errors = [];
        const normalizedLanguage = this.LANGUAGE_MAP[language] || language;
        switch (normalizedLanguage) {
            case 'python3':
            case 'python':
                if (code.includes('print(') && !code.includes(')')) {
                    errors.push('Python: Missing closing parenthesis in print statement');
                }
                if (code.includes('input(') && !code.includes(')')) {
                    errors.push('Python: Missing closing parenthesis in input statement');
                }
                break;
            case 'nodejs':
            case 'javascript':
                if (code.includes('console.log(') && !code.includes(')')) {
                    errors.push('JavaScript: Missing closing parenthesis in console.log');
                }
                if (code.includes('function') && !code.includes('{')) {
                    errors.push('JavaScript: Missing opening brace in function');
                }
                break;
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
}
exports.MockCodeExecutionService = MockCodeExecutionService;
exports.mockCodeExecutionService = new MockCodeExecutionService();
//# sourceMappingURL=mockCodeExecutionService.js.map