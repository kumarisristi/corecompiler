"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggers = exports.morganStream = exports.logger = void 0;
const winston_1 = __importDefault(require("winston"));
const path_1 = __importDefault(require("path"));
const logLevel = process.env.LOG_LEVEL || 'info';
const logsDir = path_1.default.join(process.cwd(), 'logs');
exports.logger = winston_1.default.createLogger({
    level: logLevel,
    format: winston_1.default.format.combine(winston_1.default.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
    }), winston_1.default.format.errors({ stack: true }), winston_1.default.format.json()),
    defaultMeta: { service: 'codelearn-backend' },
    transports: [
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5242880,
            maxFiles: 5
        }),
        new winston_1.default.transports.File({
            filename: path_1.default.join(logsDir, 'combined.log'),
            maxsize: 5242880,
            maxFiles: 5
        })
    ],
});
if (process.env.NODE_ENV !== 'production') {
    exports.logger.add(new winston_1.default.transports.Console({
        format: winston_1.default.format.combine(winston_1.default.format.colorize(), winston_1.default.format.simple(), winston_1.default.format.printf(({ timestamp, level, message, ...meta }) => {
            return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''}`;
        }))
    }));
}
exports.morganStream = {
    write: (message) => {
        exports.logger.info(message.trim());
    }
};
exports.loggers = {
    info: (message, meta) => exports.logger.info(message, meta),
    error: (message, error) => exports.logger.error(message, error),
    warn: (message, meta) => exports.logger.warn(message, meta),
    debug: (message, meta) => exports.logger.debug(message, meta),
    http: (message, meta) => exports.logger.info(`[HTTP] ${message}`, meta),
    auth: (message, meta) => exports.logger.info(`[AUTH] ${message}`, meta),
    compiler: (message, meta) => exports.logger.info(`[COMPILER] ${message}`, meta),
    database: (message, meta) => exports.logger.info(`[DATABASE] ${message}`, meta),
    security: (message, meta) => exports.logger.warn(`[SECURITY] ${message}`, meta),
};
exports.default = exports.logger;
//# sourceMappingURL=logger.js.map