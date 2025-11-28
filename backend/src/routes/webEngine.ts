import express, { Request, Response } from 'express';
import { webEngineService } from '../services/webEngineService';
import { logger } from '../utils/logger';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limiting for web engine endpoints
const webEngineLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // limit each IP to 20 requests per minute
  message: {
    error: 'Too many web execution requests, please try again later.',
    retryAfter: '60 seconds'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all web engine routes
router.use('/web', webEngineLimiter);

/**
 * POST /api/web-engine/execute
 * Execute HTML/CSS/JavaScript code in headless browser
 */
router.post('/execute', async (req: Request, res: Response) => {
  try {
    const {
      html,
      css,
      javascript,
      url,
      viewport,
      timeout
    } = req.body;

    // Validate input
    if (!html && !css && !javascript && !url) {
      return res.status(400).json({
        success: false,
        error: 'At least one of html, css, javascript, or url is required'
      });
    }

    if (url && (!html && !css && !javascript)) {
      // URL execution only
      if (!webEngineService.isTechnologySupported('url')) {
        return res.status(400).json({
          success: false,
          error: 'URL execution not supported'
        });
      }
    }

    logger.info('[WEB_ENGINE] Web execution requested', {
      hasHtml: !!html,
      hasCss: !!css,
      hasJavaScript: !!javascript,
      hasUrl: !!url,
      codeLengths: {
        html: html?.length || 0,
        css: css?.length || 0,
        javascript: javascript?.length || 0
      },
      ip: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Execute web code
    const result = await webEngineService.executeWebCode({
      html,
      css,
      javascript,
      url,
      viewport,
      timeout
    });

    // Log the execution result
    logger.info('[WEB_ENGINE] Web execution completed', {
      success: result.success,
      executionTime: result.executionTime,
      hasScreenshot: !!result.screenshot,
      hasHtml: !!result.html,
      hasError: !!result.error,
      ip: req.ip
    });

    // Return response
    res.json({
      success: true,
      data: result
    });

  } catch (error) {
    logger.error('[WEB_ENGINE] Web execution route error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Internal server error during web execution',
      message: process.env.NODE_ENV === 'development' ? error instanceof Error ? error.message : 'Unknown error' : 'Something went wrong'
    });
  }
});

/**
 * GET /api/web-engine/languages
 * Get list of supported web technologies
 */
router.get('/technologies', (req: Request, res: Response) => {
  try {
    const technologies = webEngineService.getSupportedTechnologies();
    
    res.json({
      success: true,
      data: {
        technologies,
        count: technologies.length
      }
    });
  } catch (error) {
    logger.error('[WEB_ENGINE] Technologies route error:', error);
    
    res.status(500).json({
      success: false,
      error: 'Failed to fetch supported technologies'
    });
  }
});

/**
 * GET /api/web-engine/health
 * Health check for the web engine service
 */
router.get('/health', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Test with simple HTML
    const testResult = await webEngineService.executeWebCode({
      html: '<h1 style="color: blue;">Web Engine Health Check</h1><p>Success!</p>',
      css: 'body { font-family: Arial, sans-serif; margin: 40px; }',
      javascript: 'console.log("Health check executed");',
      timeout: 10000
    });

    const responseTime = Date.now() - startTime;

    res.json({
      success: true,
      data: {
        status: testResult.success ? 'healthy' : 'unhealthy',
        responseTime,
        testExecution: {
          success: testResult.success,
          hasScreenshot: !!testResult.screenshot,
          executionTime: testResult.executionTime,
          error: testResult.error
        },
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error('[WEB_ENGINE] Health check failed:', error);
    
    res.status(503).json({
      success: false,
      error: 'Web engine service is unhealthy',
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/web-engine/stats
 * Get web engine statistics
 */
router.get('/stats', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      supportedTechnologies: webEngineService.getSupportedTechnologies().length,
      uptime: process.uptime(),
      memoryUsage: process.memoryUsage(),
      nodeVersion: process.version
    }
  });
});

export default router;