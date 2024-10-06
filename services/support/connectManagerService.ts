import db from '../../Model';
import { updateMessage, UUID, } from '../../util';

type TUserStatus = 'active' | 'inactive';

// IN DB with messages save all messages by connectionId
// Auth and UserSessionData tables have the relation 
interface IUserData {
    connectId: string;
    currentSocketId: string;
    userStatus?: TUserStatus;
    role?: string;
    userId?: number;
}

const supports = new Set<IUserData>();
const userQueue: IUserData[] = [];

// Initialize user data to set up a support chat session
export const validateConnectionId = async (data) => {
    const result = await db.UserSessionData.findOne({
        where: { connectId: data.connectId, },
        include: [{
            model: db.User,
            require: false,
            attributes: ['id', 'role'],
        }],
        raw: true,
        nest: true,
    });

    return result;
};
export const createConnectionId = async (data) => {
    const socketId = data.socketId.toString() as string;

    const result = await db.UserSessionData.findOne({
        where: { currentSocketId: data?.socketId, },
        include: [{
            model: db.User,
            require: false,
            attributes: ['id', 'role'],
        }],
    });

    if (result) {
        return updateMessage({ message: 'connectId is exist', messageCode: 'support-0001', }, 600);
    }
    const newConnectionId = UUID();

    const userData: IUserData = {
        connectId: newConnectionId,
        currentSocketId: socketId,
        userId: result ? result.User.id : null,
    };

    await db.UserSessionData.create(userData);

    userData.userStatus = 'active';
    return userData;
};

const leaveSupportChat = async (connectId) => {
    for (const support of supports) {
        if (support.connectId === connectId) {
            supports.delete(support);
            return;
        }
    }
};

const leaveUserChat = async (connectId) => {
    const index = userQueue.findIndex(u => u.connectId === connectId);
    userQueue.splice(index, 1);
};

interface IChangeUserStatus {
    socketId: string | undefined;
    userSessionId?: string;
    status: TUserStatus;
    newSocketId?: string;
}
export const changeUserStatus = async ({ socketId, userSessionId, status, newSocketId, }: IChangeUserStatus) => {
    const query = {
        where: {},
        include: [{
            model: db.User,
            require: false,
            attributes: ['id', 'role'],
        }],
        raw: true,
        nest: true,
    };

    socketId ? query.where = { currentSocketId: socketId, } : query.where = { id: userSessionId, };

    const updateUserStatus = await db.UserSessionData.findOne(query);

    if (updateUserStatus) {
        updateUserStatus?.User?.role === 'support' ?
            leaveSupportChat(updateUserStatus?.connectId) :
            leaveUserChat(updateUserStatus?.connectId);


        if (newSocketId) {
            updateUserStatus.currentSocketId = newSocketId;
            await db.UserSessionData.update(updateUserStatus, query);
        }

        updateUserStatus.userStatus = status;

        return updateUserStatus;
    }
    return updateUserStatus;
};

export const joinUserToSupportChat = async (data, socketId) => {
    const newSupport: IUserData = {
        connectId: data.connectId,
        currentSocketId: socketId,
        userStatus: 'active',
    };

    supports.add(newSupport);
    return;
};

export const joinUserToUserQueue = async (data, socketId) => {
    const newSupport: IUserData = {
        connectId: data.connectId,
        currentSocketId: socketId,
        userStatus: 'active',
    };

    userQueue.push(newSupport);
    return;
};

export const getAllConnectedSupports = async () => {
    return supports;
};

export const getQueuedUsers = async () => {
    return userQueue;
};