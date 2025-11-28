"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisUtils = exports.disconnectRedis = exports.getRedisClient = exports.connectRedis = void 0;
const redis_1 = require("redis");
const logger_1 = require("../utils/logger");
let _redisClient = null;
const connectRedis = async () => {
    try {
        const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
        _redisClient = (0, redis_1.createClient)({
            url: redisUrl,
            password: process.env.REDIS_PASSWORD || undefined,
            socket: {
                connectTimeout: 60000,
            },
        });
        _redisClient.on('error', (err) => {
            logger_1.logger.error('Redis Client Error:', err);
        });
        _redisClient.on('connect', () => {
            logger_1.logger.info('✅ Redis connected successfully');
        });
        _redisClient.on('ready', () => {
            logger_1.logger.info('🚀 Redis client ready');
        });
        _redisClient.on('end', () => {
            logger_1.logger.warn('Redis connection closed');
        });
        await _redisClient.connect();
        await _redisClient.ping();
        logger_1.logger.info('✅ Redis connection tested successfully');
    }
    catch (error) {
        logger_1.logger.error('❌ Redis connection failed:', error);
        logger_1.logger.warn('Continuing without Redis cache...');
    }
};
exports.connectRedis = connectRedis;
const getRedisClient = () => {
    return redisClient || null;
};
exports.getRedisClient = getRedisClient;
const disconnectRedis = async () => {
    try {
        if (redisClient && redisClient.isOpen) {
            await redisClient.quit();
            logger_1.logger.info('✅ Redis disconnected successfully');
        }
    }
    catch (error) {
        logger_1.logger.error('❌ Redis disconnection failed:', error);
    }
};
exports.disconnectRedis = disconnectRedis;
exports.redisUtils = {
    async set(key, value, expirySeconds) {
        if (!redisClient)
            return;
        try {
            if (expirySeconds) {
                await redisClient.setEx(key, expirySeconds, value);
            }
            else {
                await redisClient.set(key, value);
            }
        }
        catch (error) {
            logger_1.logger.error(`Redis SET error for key ${key}:`, error);
        }
    },
    async get(key) {
        if (!redisClient)
            return null;
        try {
            return await redisClient.get(key);
        }
        catch (error) {
            logger_1.logger.error(`Redis GET error for key ${key}:`, error);
            return null;
        }
    },
    async del(key) {
        if (!redisClient)
            return;
        try {
            await redisClient.del(key);
        }
        catch (error) {
            logger_1.logger.error(`Redis DEL error for key ${key}:`, error);
        }
    },
    async exists(key) {
        if (!redisClient)
            return false;
        try {
            const result = await redisClient.exists(key);
            return result === 1;
        }
        catch (error) {
            logger_1.logger.error(`Redis EXISTS error for key ${key}:`, error);
            return false;
        }
    },
    async setHash(field, key, value) {
        if (!redisClient)
            return;
        try {
            await redisClient.hSet(field, key, value);
        }
        catch (error) {
            logger_1.logger.error(`Redis HSET error for field ${field}, key ${key}:`, error);
        }
    },
    async getHash(field, key) {
        if (!redisClient)
            return null;
        try {
            const result = await redisClient.hGet(field, key);
            return result || null;
        }
        catch (error) {
            logger_1.logger.error(`Redis HGET error for field ${field}, key ${key}:`, error);
            return null;
        }
    },
    async increment(key) {
        if (!redisClient)
            return 0;
        try {
            return await redisClient.incr(key);
        }
        catch (error) {
            logger_1.logger.error(`Redis INCR error for key ${key}:`, error);
            return 0;
        }
    }
};
exports.default = redisClient;
//# sourceMappingURL=redis.js.map