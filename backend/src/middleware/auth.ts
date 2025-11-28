import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { UnauthorizedError } from './errorHandler';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

// JWT token verification middleware
export const authMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      logger.warn('Auth middleware: No token provided', {
        ip: req.ip,
        url: req.url,
        method: req.method
      });
      throw new UnauthorizedError('Access token is required');
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logger.error('JWT_SECRET environment variable is not set');
      throw new Error('Server configuration error');
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Add user info to request object
    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    logger.info('User authenticated successfully', {
      userId: req.user.id,
      email: req.user.email,
      url: req.url,
      method: req.method
    });

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn('Auth middleware: Token expired', {
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

    if (error instanceof jwt.JsonWebTokenError) {
      logger.warn('Auth middleware: Invalid token', {
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

    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Authentication failed'
    });
  }
};

// Optional auth middleware (doesn't require token but validates if provided)
export const optionalAuthMiddleware = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const token = extractToken(req);
    
    if (!token) {
      return next(); // Continue without authentication
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return next(); // Continue without authentication
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    req.user = {
      id: decoded.id || decoded.userId,
      email: decoded.email,
      role: decoded.role || 'user'
    };

    logger.info('Optional auth: User authenticated', {
      userId: req.user.id,
      email: req.user.email,
      url: req.url
    });

    next();
  } catch (error) {
    // For optional auth, we just log and continue
    logger.warn('Optional auth failed:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: req.ip,
      url: req.url
    });
    next(); // Continue without authentication
  }
};

// Role-based authorization middleware
export const requireRole = (allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn('Role authorization failed', {
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

// Admin only middleware
export const requireAdmin = requireRole(['admin']);

// Moderator or Admin middleware
export const requireModerator = requireRole(['admin', 'moderator']);

// Extract token from request headers
function extractToken(req: Request): string | null {
  // Check Authorization header
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Check cookie (if using cookies for auth)
  const token = req.cookies?.accessToken;
  if (token) {
    return token;
  }

  // Check query parameter (less secure, but sometimes needed)
  const queryToken = req.query.token as string;
  if (queryToken) {
    logger.warn('Token provided via query parameter (less secure)', {
      ip: req.ip,
      url: req.url
    });
    return queryToken;
  }

  return null;
}

// Generate JWT token
export const generateToken = (payload: any, expiresIn: string = '7d'): string => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(payload, jwtSecret as string, { expiresIn });
};

// Generate refresh token
export const generateRefreshToken = (payload: any): string => {
  const jwtSecret = process.env.JWT_SECRET as string;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.sign(payload, jwtSecret, { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' });
};

// Verify refresh token
export const verifyRefreshToken = (token: string): any => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('JWT_SECRET environment variable is not set');
  }

  return jwt.verify(token, jwtSecret);
};

// Check if user owns resource
export const checkResourceOwnership = (resourceUserId: string, currentUserId: string): boolean => {
  return resourceUserId === currentUserId;
};