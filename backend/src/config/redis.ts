import { createClient, RedisClientType } from 'redis';
import { logger } from '../utils/logger';

declare global {
  var redisClient: RedisClientType | undefined;
}

let _redisClient: RedisClientType | null = null;

export const connectRedis = async (): Promise<void> => {
  try {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    
    _redisClient = createClient({
      url: redisUrl,
      password: process.env.REDIS_PASSWORD || undefined,
      socket: {
        connectTimeout: 60000,
      },
    });

    // Event listeners
    _redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err);
    });

    _redisClient.on('connect', () => {
      logger.info('✅ Redis connected successfully');
    });

    _redisClient.on('ready', () => {
      logger.info('🚀 Redis client ready');
    });

    _redisClient.on('end', () => {
      logger.warn('Redis connection closed');
    });

    // Connect to Redis
    await _redisClient.connect();
    
    // Test connection
    await _redisClient.ping();
    logger.info('✅ Redis connection tested successfully');

  } catch (error) {
    logger.error('❌ Redis connection failed:', error);
    // Don't exit process, continue without Redis
    logger.warn('Continuing without Redis cache...');
  }
};

export const getRedisClient = (): RedisClientType | null => {
  return redisClient || null;
};

export const disconnectRedis = async (): Promise<void> => {
  try {
    if (redisClient && redisClient.isOpen) {
      await redisClient.quit();
      logger.info('✅ Redis disconnected successfully');
    }
  } catch (error) {
    logger.error('❌ Redis disconnection failed:', error);
  }
};

// Utility functions for common Redis operations
export const redisUtils = {
  async set(key: string, value: string, expirySeconds?: number): Promise<void> {
    if (!redisClient) return;
    
    try {
      if (expirySeconds) {
        await redisClient.setEx(key, expirySeconds, value);
      } else {
        await redisClient.set(key, value);
      }
    } catch (error) {
      logger.error(`Redis SET error for key ${key}:`, error);
    }
  },

  async get(key: string): Promise<string | null> {
    if (!redisClient) return null;
    
    try {
      return await redisClient.get(key);
    } catch (error) {
      logger.error(`Redis GET error for key ${key}:`, error);
      return null;
    }
  },

  async del(key: string): Promise<void> {
    if (!redisClient) return;
    
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error(`Redis DEL error for key ${key}:`, error);
    }
  },

  async exists(key: string): Promise<boolean> {
    if (!redisClient) return false;
    
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error(`Redis EXISTS error for key ${key}:`, error);
      return false;
    }
  },

  async setHash(field: string, key: string, value: string): Promise<void> {
    if (!redisClient) return;
    
    try {
      await redisClient.hSet(field, key, value);
    } catch (error) {
      logger.error(`Redis HSET error for field ${field}, key ${key}:`, error);
    }
  },

  async getHash(field: string, key: string): Promise<string | null> {
    if (!redisClient) return null;
    
    try {
      const result = await redisClient.hGet(field, key);
      return result || null;
    } catch (error) {
      logger.error(`Redis HGET error for field ${field}, key ${key}:`, error);
      return null;
    }
  },

  async increment(key: string): Promise<number> {
    if (!redisClient) return 0;
    
    try {
      return await redisClient.incr(key);
    } catch (error) {
      logger.error(`Redis INCR error for key ${key}:`, error);
      return 0;
    }
  }
};

export default redisClient as RedisClientType | null;