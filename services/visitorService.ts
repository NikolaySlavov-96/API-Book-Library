import { getCurrentDate, calculateRelativeDate, } from '../Helpers';

import UserDataModel from '../Model/UserDataModel';

import { addDataToSet, deleteCacheEntry, fetchSetSize, } from './cacheService';

export const storeVisitorInfo = async (data) => {
    const redisKey = getCurrentDate();
    const userIp = data.IPv4.toString();

    const returnedData = {
        dailyUsers: 0,
        uncialUsers: 0,
        isNewUser: false,
    };

    try {
        // Check and Insert in Mongo DB
        const resultMongo = await UserDataModel.findOne({ userAddress: userIp, });
        if (!resultMongo) {
            await UserDataModel.create({ userAddress: userIp, });
        }
        const allUncialUser = await UserDataModel.countDocuments();
        returnedData.uncialUsers = allUncialUser;

        // Check and Insert in Redis
        // Added record in Array
        const resultRedis = await addDataToSet(redisKey, userIp);
        if (resultRedis) {
            returnedData.isNewUser = true;
        }
        // Create new records
        // const uniqueIPs = await redisClient.sMembers('key');

        // Return only count of exist records in Array
        const uniqueIPs = await fetchSetSize(redisKey);
        returnedData.dailyUsers = Number(uniqueIPs);
        return returnedData;
    } catch (err) {
        console.log('Visitor Service ~ storeVisitorInfo ~ :', err);
        return returnedData;
    }
};

const deleteKey = async () => {
    const key = calculateRelativeDate(1, 'day');
    try {
        await deleteCacheEntry(key);
    } catch (err) {
        console.log(err);
    }
};