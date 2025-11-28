import { RedisClientType } from 'redis';
declare global {
    var redisClient: RedisClientType | undefined;
}
export declare const connectRedis: () => Promise<void>;
export declare const getRedisClient: () => RedisClientType | null;
export declare const disconnectRedis: () => Promise<void>;
export declare const redisUtils: {
    set(key: string, value: string, expirySeconds?: number): Promise<void>;
    get(key: string): Promise<string | null>;
    del(key: string): Promise<void>;
    exists(key: string): Promise<boolean>;
    setHash(field: string, key: string, value: string): Promise<void>;
    getHash(field: string, key: string): Promise<string | null>;
    increment(key: string): Promise<number>;
};
declare const _default: RedisClientType | null;
export default _default;
//# sourceMappingURL=redis.d.ts.map