import { redisClient } from '../config';
import { cacheTimes } from '../constants';
import { createLogger } from '../Helpers';
import { normalizeInputData } from '../util';

const log = createLogger('cacheService');

// Store and manage cached data using Redis for
// improved performance and quick data retrieval
export const fetchCacheData = async (key) => {
    return redisClient.get(key);
};

export const cacheDataWithExpiration = async (key, data, time = cacheTimes.HOURS) => {
    await redisClient.setEx(key, time, JSON.stringify(data));
};

// Use Redis SET to store only unique data entries,
// automatically handling duplicates
export const fetchSetMembers = async (key): Promise<string[]> => {
    const result = await redisClient.sMembers(key);
    const arr = Array.isArray(result) ? result : Array.from(result as Iterable<unknown>);
    return arr.map((v) => normalizeInputData(v));
};

export const fetchSetSize = async (key) => {
    return redisClient.sCard(key);
};

export const addDataToSet = async (key, data) => {
    return redisClient.sAdd(key, data);
};

export const removeDataFromSet = async (key: string, data: string) => {
    return redisClient.sRem(key, data);
};

export const isSetMember = async (key: string, data: string): Promise<boolean> => {
    const result = (await redisClient.sIsMember(key, data)) as unknown as number | boolean;
    return Number(result) === 1 || result === true;
};

export const setKeyExpiration = async (key: string, ttlSeconds: number) => {
    return redisClient.expire(key, ttlSeconds);
};

// Distributed rate limiter primitive: increments a counter and sets TTL on first hit.
// Returns the resulting counter value.
export const incrementWithTtl = async (key: string, ttlMs: number): Promise<number> => {
    const val = Number(await redisClient.incr(key));
    if (val === 1) {
        await redisClient.pExpire(key, ttlMs);
    }
    return val;
};

// Implement functionality to delete specific data or keys from Redis
export const deleteCacheEntry = async (key) => {
    const result = await redisClient.del(key);

    if (result === 1) {
        return true;
    }

    return false;
};
export const deleteKeysWithPrefix = async (prefix) => {
    try {
        let cursorCount = 0;
        // TODO(lint): sequential scan + delete is intentional (paginated cursor); review if pipelining is safer (no-await-in-loop).
        do {
            const { cursor, keys } = await redisClient.scan(cursorCount.toString(), {
                MATCH: `${prefix}*`,
                COUNT: 20,
            });
            const dataString = normalizeInputData(cursor);
            cursorCount = Number(dataString);

            if (keys.length > 0) {
                // TODO(lint): consider deleting in parallel inside one pipeline (no-await-in-loop).
                await deleteCacheEntry(keys);
            }
        } while (cursorCount !== 0);
    } catch (err) {
        log.error('Error ~ deleteKeysWithPrefix: ', err);
    } finally {
        // If a new Redis connection is created solely for erasing keys, ensure to
        // call "quit" to properly close the connection afterward
        // redisClient.quit();
    }
};
