"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const logger_1 = require("./utils/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const compiler_1 = __importDefault(require("./routes/compiler"));
const webEngine_1 = __importDefault(require("./routes/webEngine"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));
const corsOptions = {
    origin: function (origin, callback) {
        const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
        if (!origin || allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};
app.use((0, cors_1.default)(corsOptions));
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
    message: {
        error: 'Too many requests from this IP, please try again later.',
        retryAfter: '15 minutes'
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/', limiter);
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
if (process.env.NODE_ENV === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined', { stream: { write: (message) => logger_1.logger.info(message.trim()) } }));
}
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV,
        version: '1.0.0'
    });
});
app.use('/api/compiler', compiler_1.default);
app.use('/api/web-engine', webEngine_1.default);
if (process.env.NODE_ENV === 'production') {
    app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
    app.get('*', (req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
    });
}
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl,
        method: req.method
    });
});
app.use(errorHandler_1.errorHandler);
process.on('SIGTERM', async () => {
    logger_1.logger.info('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});
process.on('SIGINT', async () => {
    logger_1.logger.info('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});
process.on('unhandledRejection', (reason, promise) => {
    logger_1.logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});
process.on('uncaughtException', (error) => {
    logger_1.logger.error('Uncaught Exception:', error);
    process.exit(1);
});
async function startServer() {
    try {
        const server = app.listen(PORT, () => {
            logger_1.logger.info(`🚀 Server running on port ${PORT}`);
            logger_1.logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
            logger_1.logger.info(`🏥 Health check: http://localhost:${PORT}/health`);
            logger_1.logger.info(`💻 Code Compiler: http://localhost:${PORT}/api/compiler`);
            logger_1.logger.info(`🌐 Web Engine: http://localhost:${PORT}/api/web-engine`);
        });
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger_1.logger.error(`Port ${PORT} is already in use`);
            }
            else {
                logger_1.logger.error('Server error:', error);
            }
            process.exit(1);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
}
if (require.main === module) {
    startServer();
}
//# sourceMappingURL=server.js.map