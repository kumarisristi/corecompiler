import express, { Request, Response } from 'express';
import { judge0CodeExecutionService } from '../services/judge0CodeExecutionService';
import { alternativeCodeExecutionService } from '../services/alternativeCodeExecutionService';
import { directCppExecutionService } from '../services/directCppExecutionService';
import { logger } from '../utils/logger';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for code execution endpoints
const executionLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per minute
  message: {
    error: 'Too many code execution requests, please try again later.',
    retryAfter: '60 seconds'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all execution routes
router.use('/execute', executionLimiter);

/**
 * POST /api/compiler/execute
 * Execute code with provided input
 */
router.post('/execute', async (req: Request, res: Response) => {
    try {
      // Manual validation
      const { language, code, input, timeLimit } = req.body;
      
      if (!language || typeof language !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Language is required and must be a string'
        });
      }
      
      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Code is required and must be a string'
        });
      }

      // Check if language is supported
      if (!judge0CodeExecutionService.isLanguageSupported(language) && !directCppExecutionService.isLanguageSupported(language)) {
        return res.status(400).json({
          success: false,
          error: `Unsupported language: ${language}. Supported languages: ${[...judge0CodeExecutionService.getSupportedLanguages(), ...directCppExecutionService.getSupportedLanguages()].join(', ')}`
        });
      }

      logger.info(`[COMPILER] Code execution requested`, {
        language,
        codeLength: code ? code.length : 0,
        hasInput: !!input,
        ip: req.ip,
        userAgent: req.get('User-Agent')
      });

      let result;

      // For C++ star patterns specifically, use direct execution service
      if (directCppExecutionService.isLanguageSupported(language)) {
        const codeLower = code.toLowerCase();
        if (codeLower.includes('star pattern') && codeLower.includes('for') && codeLower.includes('*')) {
          logger.info('[COMPILER] Using direct C++ execution service for star pattern');
          result = await directCppExecutionService.executeCode({
            language,
            code,
            input,
            timeLimit
          });
        } else {
          // For other C++ code, use Judge0
          logger.info('[COMPILER] Using Judge0 execution service for C++');
          result = await judge0CodeExecutionService.executeCode({
            language,
            code,
            input,
            timeLimit
          });
        }
      } else {
        // For other languages, try Judge0 first
        logger.info('[COMPILER] Using Judge0 execution service');
        result = await judge0CodeExecutionService.executeCode({
          language,
          code,
          input,
          timeLimit
        });
      }

      // If Judge0 fails with file size limit, try alternative service
      if (result.status === 'file_size_limit_exceeded' && alternativeCodeExecutionService.isLanguageSupported(language)) {
        logger.warn(`[COMPILER] Judge0 failed with file size limit, trying alternative service for ${language}`);
        
        result = await alternativeCodeExecutionService.executeCode({
          language,
          code,
          input,
          timeLimit
        });
        
        // Mark that we used fallback
        result.error = result.error ? `[FALLBACK] ${result.error}` : '[FALLBACK] Executed using alternative service';
      }

      // Log the execution result
      logger.info(`[COMPILER] Code execution completed`, {
        language,
        status: result.status,
        executionTime: result.executionTime,
        hasError: !!result.error,
        ip: req.ip
      });

      // Return response
      res.json({
        success: true,
        data: {
          output: result.output,
          error: result.error,
          executionTime: result.executionTime,
          memoryUsage: result.memoryUsage,
          status: result.status
        }
      });

    } catch (error) {
      logger.error('[COMPILER] Execution route error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error during code execution',
        message: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : 'Something went wrong'
      });
    }
  });

/**
 * GET /api/compiler/languages
 * Get list of supported programming languages
 */
router.get('/languages', (req: Request, res: Response) => {
  try {
    // Only show Judge0 supported languages
    const languages = judge0CodeExecutionService.getSupportedLanguages();
    
    res.json({
      success: true,
      data: {
        languages,
        count: languages.length
      }
    });
  } catch (error) {
    logger.error('[COMPILER] Languages route error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supported languages'
    });
  }
});

/**
 * POST /api/compiler/validate
 * Validate code syntax (basic validation)
 */
router.post('/validate',
  async (req: Request, res: Response) => {
    try {
      const { code, language } = req.body;
      
      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Code is required and must be a string'
        });
      }
      
      if (!language || typeof language !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Language is required and must be a string'
        });
      }

      // Basic validation - return success for now
      const validation = {
        isValid: true,
        errors: []
      };

      res.json({
        success: true,
        data: validation
      });

    } catch (error) {
      logger.error('[COMPILER] Validation route error:', error);
      
      res.status(500).json({
        success: false,
        error: 'Internal server error during validation'
      });
    }
  });

/**
 * POST /api/compiler/health
 * Health check for the code execution service
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Test with a simple code snippet
    const testResult = await judge0CodeExecutionService.executeCode({
      language: 'python',
      code: 'print("Health check passed")',
      timeLimit: 5000
    });

    const responseTime = Date.now() - startTime;

    res.json({
      success: true,
      data: {
        status: 'healthy',
        responseTime,
        testExecution: {
          status: testResult.status,
          hasOutput: !!testResult.output,
          executionTime: testResult.executionTime
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('[COMPILER] Health check failed:', error);
    
    res.status(503).json({
      success: false,
      error: 'Code execution service is unhealthy',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/compiler/stats
 * Get execution statistics (placeholder for future implementation)
 */
router.get('/stats', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      supportedLanguages: judge0CodeExecutionService.getSupportedLanguages().length,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version
    }
  });
});

export default router;