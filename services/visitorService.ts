import { calculateRelativeDate, createLogger, getCurrentDate } from '../Helpers';
import { repositories } from '../repositories';

import { addDataToSet, deleteCacheEntry, fetchSetSize } from './cacheService';

const log = createLogger('visitorService');

export const storeVisitorInfo = async (data) => {
    const redisKey = getCurrentDate();
    const userIp = data.IPv4.toString();

    const returnedData = {
        dailyUsers: 0,
        uncialUsers: 0,
        isNewUser: false,
    };

    try {
        const existing = await repositories.userData.findByAddress(userIp);
        if (!existing) {
            await repositories.userData.create({ userAddress: userIp });
        }
        returnedData.uncialUsers = await repositories.userData.countAll();

        const resultRedis = await addDataToSet(redisKey, userIp);
        if (resultRedis) {
            returnedData.isNewUser = true;
        }

        const uniqueIPs = await fetchSetSize(redisKey);
        returnedData.dailyUsers = Number(uniqueIPs);
        return returnedData;
    } catch (err) {
        log.error('storeVisitorInfo ~ :', err);
        return returnedData;
    }
};

// Kept for potential cleanup tasks; not currently wired up.
export const cleanupExpiredVisitorKey = async () => {
    const key = calculateRelativeDate(1, 'day');
    try {
        await deleteCacheEntry(key);
    } catch (err) {
        log.error('cleanupExpiredVisitorKey ~ :', err);
    }
};
