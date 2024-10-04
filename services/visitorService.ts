import { getCurrentDate, calculateRelativeDate, } from '../Helpers';

import { redisClient, } from '../config';

import UserDataModel from '../Model/UserDataModel';

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
        const resultRedis = await redisClient.sAdd(redisKey, userIp);
        if (resultRedis) {
            returnedData.isNewUser = true;
        }
        // Create new records
        // const uniqueIPs = await redisClient.sMembers('key');

        // Return only count of exist records in Array
        const uniqueIPs = await redisClient.sCard(redisKey);
        returnedData.dailyUsers = uniqueIPs;
        return returnedData;
    } catch (err) {
        console.log('Visitor Service ~ storeVisitorInfo ~ :', err);
        return returnedData;
    }
};

const deleteKey = async () => {
    const key = calculateRelativeDate(1, 'day');
    try {
        await redisClient.del(key);
    } catch (err) {
        console.log(err);
    }
};