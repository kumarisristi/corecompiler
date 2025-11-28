"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkResourceOwnership = exports.verifyRefreshToken = exports.generateRefreshToken = exports.generateToken = exports.requireModerator = exports.requireAdmin = exports.requireRole = exports.optionalAuthMiddleware = exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utils/logger");
const errorHandler_1 = require("./errorHandler");
const authMiddleware = (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            logger_1.logger.warn('Auth middleware: No token provided', {
                ip: req.ip,
                url: req.url,
                method: req.method
            });
            throw new errorHandler_1.UnauthorizedError('Access token is required');
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            logger_1.logger.error('JWT_SECRET environment variable is not set');
            throw new Error('Server configuration error');
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = {
            id: decoded.id || decoded.userId,
            email: decoded.email,
            role: decoded.role || 'user'
        };
        logger_1.logger.info('User authenticated successfully', {
            userId: req.user.id,
            email: req.user.email,
            url: req.url,
            method: req.method
        });
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            logger_1.logger.warn('Auth middleware: Token expired', {
                ip: req.ip,
                url: req.url,
                method: req.method
            });
            return res.status(401).json({
                success: false,
                error: 'Token has expired',
                code: 'TOKEN_EXPIRED'
            });
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            logger_1.logger.warn('Auth middleware: Invalid token', {
                ip: req.ip,
                url: req.url,
                method: req.method
            });
            return res.status(401).json({
                success: false,
                error: 'Invalid access token',
                code: 'INVALID_TOKEN'
            });
        }
        logger_1.logger.error('Auth middleware error:', error);
        return res.status(500).json({
            success: false,
            error: 'Authentication failed'
        });
    }
};
exports.authMiddleware = authMiddleware;
const optionalAuthMiddleware = (req, res, next) => {
    try {
        const token = extractToken(req);
        if (!token) {
            return next();
        }
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
            return next();
        }
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = {
            id: decoded.id || decoded.userId,
            email: decoded.email,
            role: decoded.role || 'user'
        };
        logger_1.logger.info('Optional auth: User authenticated', {
            userId: req.user.id,
            email: req.user.email,
            url: req.url
        });
        next();
    }
    catch (error) {
        logger_1.logger.warn('Optional auth failed:', {
            error: error instanceof Error ? error.message : 'Unknown error',
            ip: req.ip,
            url: req.url
        });
        next();
    }
};
exports.optionalAuthMiddleware = optionalAuthMiddleware;
const requireRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                error: 'Authentication required'
            });
        }
        if (!allowedRoles.includes(req.user.role)) {
            logger_1.logger.warn('Role authorization failed', {
                userId: req.user.id,
                userRole: req.user.role,
                requiredRoles: allowedRoles,
                url: req.url,
                method: req.method
            });
            return res.status(403).json({
                success: false,
                error: 'Insufficient permissions',
                requiredRoles: allowedRoles
            });
        }
        next();
    };
};
exports.requireRole = requireRole;
exports.requireAdmin = (0, exports.requireRole)(['admin']);
exports.requireModerator = (0, exports.requireRole)(['admin', 'moderator']);
function extractToken(req) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }
    const token = req.cookies?.accessToken;
    if (token) {
        return token;
    }
    const queryToken = req.query.token;
    if (queryToken) {
        logger_1.logger.warn('Token provided via query parameter (less secure)', {
            ip: req.ip,
            url: req.url
        });
        return queryToken;
    }
    return null;
}
const generateToken = (payload, expiresIn = '7d') => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn });
};
exports.generateToken = generateToken;
const generateRefreshToken = (payload) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return jsonwebtoken_1.default.sign(payload, jwtSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });
};
exports.generateRefreshToken = generateRefreshToken;
const verifyRefreshToken = (token) => {
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('JWT_SECRET environment variable is not set');
    }
    return jsonwebtoken_1.default.verify(token, jwtSecret);
};
exports.verifyRefreshToken = verifyRefreshToken;
const checkResourceOwnership = (resourceUserId, currentUserId) => {
    return resourceUserId === currentUserId;
};
exports.checkResourceOwnership = checkResourceOwnership;
//# sourceMappingURL=auth.js.map