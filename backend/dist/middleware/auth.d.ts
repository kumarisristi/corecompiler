import { Request, Response, NextFunction } from 'express';
export interface AuthenticatedRequest extends Request {
    user?: {
        id: string;
        email: string;
        role: string;
    };
}
export declare const authMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const optionalAuthMiddleware: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const requireRole: (allowedRoles: string[]) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const requireModerator: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const generateToken: (payload: any, expiresIn?: string) => string;
export declare const generateRefreshToken: (payload: any) => string;
export declare const verifyRefreshToken: (token: string) => any;
export declare const checkResourceOwnership: (resourceUserId: string, currentUserId: string) => boolean;
//# sourceMappingURL=auth.d.ts.map