import { redisClient, } from '../config';

import { redisCacheTimes, } from '../constants';

// Store and manage cached data using Redis for
// improved performance and quick data retrieval
export const fetchCacheData = async (key) => {
    return await redisClient.get(key);
};

export const cacheDataWithExpiration = async (key, data, time = redisCacheTimes.HOURS) => {
    await redisClient.setEx(key, time, JSON.stringify(data));
};

export const deleteCacheEntry = async (key) => {
    const result = await redisClient.del(key);

    if (result === 1) {
        return true;
    }

    return false;
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
