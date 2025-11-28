"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InternalServerError = exports.RateLimitError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.NotFoundError = exports.ValidationError = exports.CustomError = exports.asyncHandler = exports.errorHandler = void 0;
const logger_1 = require("../utils/logger");
const errorHandler = (error, req, res, next) => {
    let statusCode = error.statusCode || 500;
    let message = error.message || 'Internal Server Error';
    logger_1.logger.error('Error occurred:', {
        message: error.message,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        statusCode
    });
    if (error.name === 'ValidationError') {
        statusCode = 400;
        message = 'Validation Error';
    }
    else if (error.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid ID format';
    }
    else if (error.name === 'MongoError' && error.code === 11000) {
        statusCode = 409;
        message = 'Duplicate field value';
    }
    else if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Invalid token';
    }
    else if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expired';
    }
    else if (error.message?.includes('ENOENT')) {
        statusCode = 404;
        message = 'File not found';
    }
    else if (error.message?.includes('EACCES')) {
        statusCode = 403;
        message = 'Permission denied';
    }
    const response = {
        success: false,
        error: message,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method
    };
    if (process.env.NODE_ENV === 'development') {
        response.stack = error.stack;
        response.details = error;
    }
    if (req.headers['x-request-id']) {
        response.requestId = req.headers['x-request-id'];
    }
    res.status(statusCode).json(response);
};
exports.errorHandler = errorHandler;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
class CustomError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.CustomError = CustomError;
class ValidationError extends CustomError {
    constructor(message = 'Validation failed') {
        super(message, 400);
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends CustomError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class UnauthorizedError extends CustomError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends CustomError {
    constructor(message = 'Forbidden') {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends CustomError {
    constructor(message = 'Conflict') {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class RateLimitError extends CustomError {
    constructor(message = 'Too many requests') {
        super(message, 429);
    }
}
exports.RateLimitError = RateLimitError;
class InternalServerError extends CustomError {
    constructor(message = 'Internal server error') {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
//# sourceMappingURL=errorHandler.js.map