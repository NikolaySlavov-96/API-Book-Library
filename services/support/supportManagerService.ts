import {
    addedDataToList,
    addedStringToList,
    fetchListMembers,
    removeElementFromList,
} from '../cacheService';

type TUserStatus = 'active' | 'inactive' | 'free' | 'busy' | 'waiting';

interface IAllConnectedUsers {
    connectId: string;
    name: string;
    status: TUserStatus;
}

// Support
export const getAllOnlineSupports = async () => {
    const supportAgents = await fetchListMembers('supportAgent');
    return supportAgents;
};

export const assignSupport = async (data: string) => {
    await addedStringToList('supportAgent', data);
};

export const unassignSupport = (connectId: string) => {
    removeElementFromList('supportAgent', connectId);
};


// User
export const getAllWaitingUsers = async () => {
    const userQueue = await fetchListMembers('userQueue');
    const result = userQueue.map(uq => {
        const parseUser = JSON.parse(uq) as IAllConnectedUsers;
        return parseUser;
    });
    return result;
};
export const assignUserToQueue = async (data) => {
    await addedDataToList('userQueue', data);
};

export const isUserInQueue = async (data: { connectId: string }) => {
    const result = await fetchListMembers('userQueue');
    const userExist = result.find(u => {
        const parseUser = JSON.parse(u) as IAllConnectedUsers;
        if (parseUser.connectId === data.connectId) {
            return parseUser;
        }
    });
    return userExist as unknown as IAllConnectedUsers;
};

export const unassignUserFromQueue = async (connectId: string) => {
    const list = await fetchListMembers('userQueue');
    for (const e of list) {
        const parseE = JSON.parse(e);
        if (parseE.connectId === connectId) {
            await removeElementFromList('userQueue', e);
        }
    }
};