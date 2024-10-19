import { redisClient, } from '../config';

import { redisCacheTimes, } from '../constants';

export const fetchCacheData = async (key) => {
    return await redisClient.get(key);
};

export const cacheDataWithExpiration = async (key, data, time = redisCacheTimes.HOURS) => {
    await redisClient.setEx(key, time, JSON.stringify(data));
};
