import { redisClient, } from '../config';

import { cacheTimes, } from '../constants';
import { normalizeInputData } from '../util';

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
            const { cursor, keys, } = await redisClient.scan(cursorCount.toString(), {
                MATCH: `${prefix}*`,
                COUNT: 20,
            });
            const dataString = normalizeInputData(cursor);
            cursorCount = Number(dataString);

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

// Utilize Redis to store a list (array) where each data entry is converted to a string format
export const addedDataToList = async (key: string, value: unknown) => {
    const valueTostring = JSON.stringify(value);
    return await redisClient.rPush(key, valueTostring);
};

export const addedStringToList = async (key: string, value: string) => {
    return await redisClient.rPush(key, value);
};

export const fetchListMembers = async (key) => {
    const result = await redisClient.lRange(key, 0, -1);
    return result;
};

export const removeElementFromList = async (key, data) => {
    return await redisClient.lRem(key, 1, data);
};