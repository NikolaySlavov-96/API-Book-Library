import {
    addedDataToList,
    addedStringToList,
    fetchListMembers,
    removeElementFromList,
} from '../cacheService';

const CACHE_KEYS = {
    USER_QUEUE: 'userQueue',
    SUPPORT_AGENT: 'supportAgent',
};

interface IAllConnectedUsers {
    connectId: string;
    name: string;
}

// Support
export const getAllOnlineSupports = async () => {
    const supportAgents = await fetchListMembers(CACHE_KEYS.SUPPORT_AGENT);
    return supportAgents;
};

export const assignSupport = async (data: string) => {
    await addedStringToList(CACHE_KEYS.SUPPORT_AGENT, data);
};

export const unassignSupport = async (connectId: string) => {
    await removeElementFromList(CACHE_KEYS.SUPPORT_AGENT, connectId);
};


// User
export const getAllWaitingUsers = async () => {
    const userQueue = await fetchListMembers(CACHE_KEYS.USER_QUEUE);
    const result = userQueue.map(uq => {
        const parseUser = JSON.parse(uq) as IAllConnectedUsers;
        return parseUser;
    });
    return result;
};
export const assignUserToQueue = async (data) => {
    await addedDataToList(CACHE_KEYS.USER_QUEUE, data);
};

export const isUserInQueue = async (data: { connectId: string }) => {
    const result = await fetchListMembers(CACHE_KEYS.USER_QUEUE);
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
    const list = await fetchListMembers(CACHE_KEYS.USER_QUEUE);
    let hasUser = false;
    for (const e of list) {
        const parseE = JSON.parse(e);
        if (parseE.connectId === connectId) {
            await removeElementFromList(CACHE_KEYS.USER_QUEUE, e);
            hasUser = true;
        }
    }
    return hasUser;
};