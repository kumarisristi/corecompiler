import winston from 'winston';
export declare const logger: winston.Logger;
export declare const morganStream: {
    write: (message: string) => void;
};
export declare const loggers: {
    info: (message: string, meta?: any) => winston.Logger;
    error: (message: string, error?: any) => winston.Logger;
    warn: (message: string, meta?: any) => winston.Logger;
    debug: (message: string, meta?: any) => winston.Logger;
    http: (message: string, meta?: any) => winston.Logger;
    auth: (message: string, meta?: any) => winston.Logger;
    compiler: (message: string, meta?: any) => winston.Logger;
    database: (message: string, meta?: any) => winston.Logger;
    security: (message: string, meta?: any) => winston.Logger;
};
export default logger;
//# sourceMappingURL=logger.d.ts.map