import winston from 'winston';
import path from 'path';

// Define log levels
const logLevel = process.env.LOG_LEVEL || 'info';

// Create logs directory if it doesn't exist
const logsDir = path.join(process.cwd(), 'logs');

// Create the logger
export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'codelearn-backend' },
  transports: [
    // Write all logs with level 'error' and below to 'error.log'
    new winston.transports.File({ 
      filename: path.join(logsDir, 'error.log'), 
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5
    }),
    
    // Write all logs with level 'info' and below to 'combined.log'
    new winston.transports.File({ 
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5
    })
  ],
});

// If we're not in production, log to console with colorized simple format
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
      winston.format.printf(({ timestamp, level, message, ...meta }) => {
        return `${timestamp} [${level}]: ${message} ${
          Object.keys(meta).length ? JSON.stringify(meta, null, 2) : ''
        }`;
      })
    )
  }));
}

// Export a stream object for Morgan middleware
export const morganStream = {
  write: (message: string) => {
    logger.info(message.trim());
  }
};

// Helper functions for different log levels
export const loggers = {
  info: (message: string, meta?: any) => logger.info(message, meta),
  error: (message: string, error?: any) => logger.error(message, error),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),
  
  // Application-specific loggers
  http: (message: string, meta?: any) => logger.info(`[HTTP] ${message}`, meta),
  auth: (message: string, meta?: any) => logger.info(`[AUTH] ${message}`, meta),
  compiler: (message: string, meta?: any) => logger.info(`[COMPILER] ${message}`, meta),
  database: (message: string, meta?: any) => logger.info(`[DATABASE] ${message}`, meta),
  security: (message: string, meta?: any) => logger.warn(`[SECURITY] ${message}`, meta),
};

export default logger;