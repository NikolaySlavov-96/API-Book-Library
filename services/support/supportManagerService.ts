import { cacheKeys, } from '../../constants';

import {
    addedDataToList,
    addedStringToList,
    fetchListMembers,
    removeElementFromList,
} from '../cacheService';

interface IAllConnectedUsers {
    connectId: string;
    name: string;
}

// Support
export const getAllOnlineSupports = async () => {
    const supportAgents = await fetchListMembers(cacheKeys.SUPPORT_AGENT);
    return supportAgents;
};

export const assignSupport = async (data: string) => {
    await addedStringToList(cacheKeys.SUPPORT_AGENT, data);
};

export const unassignSupport = async (connectId: string) => {
    await removeElementFromList(cacheKeys.SUPPORT_AGENT, connectId);
};


// User
export const getAllWaitingUsers = async () => {
    const userQueue = await fetchListMembers(cacheKeys.USER_QUEUE);
    const result = userQueue.map(uq => {
        const parseUser = JSON.parse(uq) as IAllConnectedUsers;
        return parseUser;
    });
    return result;
};
export const assignUserToQueue = async (data) => {
    await addedDataToList(cacheKeys.USER_QUEUE, data);
};

export const isUserInQueue = async (data: { connectId: string }) => {
    const result = await fetchListMembers(cacheKeys.USER_QUEUE);
    const userExist = result.find(u => {
        const parseUser = JSON.parse(u) as IAllConnectedUsers;
        if (parseUser.connectId === data.connectId) {
            return parseUser;
        }
    });
    const parseAgain = JSON.parse(userExist);
    return parseAgain as IAllConnectedUsers;
};

export const unassignUserFromQueue = async (connectId: string) => {
    const list = await fetchListMembers(cacheKeys.USER_QUEUE);
    let hasUser = false;
    for (const e of list) {
        const parseE = JSON.parse(e);
        if (parseE.connectId === connectId) {
            await removeElementFromList(cacheKeys.USER_QUEUE, e);
            hasUser = true;
        }
    }
    return hasUser;
};