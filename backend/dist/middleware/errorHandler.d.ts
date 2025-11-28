import { Request, Response, NextFunction } from 'express';
export interface AppError extends Error {
    statusCode?: number;
    isOperational?: boolean;
}
export declare const errorHandler: (error: AppError, req: Request, res: Response, next: NextFunction) => void;
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
export declare class CustomError extends Error {
    statusCode: number;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, isOperational?: boolean);
}
export declare class ValidationError extends CustomError {
    constructor(message?: string);
}
export declare class NotFoundError extends CustomError {
    constructor(message?: string);
}
export declare class UnauthorizedError extends CustomError {
    constructor(message?: string);
}
export declare class ForbiddenError extends CustomError {
    constructor(message?: string);
}
export declare class ConflictError extends CustomError {
    constructor(message?: string);
}
export declare class RateLimitError extends CustomError {
    constructor(message?: string);
}
export declare class InternalServerError extends CustomError {
    constructor(message?: string);
}
//# sourceMappingURL=errorHandler.d.ts.map