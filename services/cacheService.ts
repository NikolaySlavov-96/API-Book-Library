import { redisClient, } from '../config';

import { cacheTimes, } from '../constants';

// Store and manage cached data using Redis for
// improved performance and quick data retrieval
export const fetchCacheData = async (key) => {
    return await redisClient.get(key);
};

export const cacheDataWithExpiration = async (key, data, time = cacheTimes.HOURS) => {
    await redisClient.setEx(key, time, JSON.stringify(data));
};

// Use Redis SET to store only unique data entries,
// automatically handling duplicates
export const fetchSetMembers = async (key) => {
    return await redisClient.sMembers(key);
};

export const fetchSetSize = async (key) => {
    return await redisClient.sCard(key);
};

export const addDataToSet = async (key, data) => {
    return await redisClient.sAdd(key, data);
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
        do {
            const { cursor, keys, } = await redisClient.scan(cursorCount, {
                MATCH: `${prefix}*`,
                COUNT: 20,
            });

            cursorCount = cursor;

            if (keys.length > 0) {
                await deleteCacheEntry(keys);
            }
        } while (cursorCount !== 0);
    } catch (err) {
        console.error('Error ~ deleteKeysWithPrefix: ', err);
    } finally {
        // If a new Redis connection is created solely for erasing keys, ensure to 
        // call "quit" to properly close the connection afterward
        // redisClient.quit();
    }
};

