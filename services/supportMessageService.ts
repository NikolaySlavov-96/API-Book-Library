import db from '../Model';
import { updateMessage, UUID } from '../util';

type TUserStatus = 'active' | 'inactive';

// IN DB with messages save all messages by connectionId
// Auth and UserSessionData tables have the relation 
interface IUserData {
    connectId: string;
    currentSocketId: string;
    userStatus: TUserStatus;
    role?: string;
}

const UserSessionData: IUserData[] = [];

const supports = new Set<IUserData>();

// Initialize user data to set up a support chat session
export const validateConnectionId = async (data, socketId) => {
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

    if (!result) {
        return { state: !!result, role: '', };
    }

    // await changeUserStatus(result.currentSocketId, 'active', socketId); // Check and Improve
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

    const userData = {
        connectId: newConnectionId,
        currentSocketId: socketId,
        userStatus: 'active',
        userId: result ? result.User.id : null,
    };

    await db.UserSessionData.create(userData);

    return userData;
};

export const changeUserStatus = async (socketId, status: TUserStatus, newSocketId?: string) => {
    const updateUserStatus = UserSessionData.find(u => u.currentSocketId === socketId);
    if (updateUserStatus) {
        // IN DB findOneAndUpdate()
        newSocketId ? updateUserStatus.currentSocketId = newSocketId : null;
        updateUserStatus.userStatus = status;
        return updateUserStatus;
    }
    return updateUserStatus;
};

export const joinUserToSupportChat = async (data, socketId) => {
    const newConnectionId = UUID();

    const newSupport: IUserData = {
        connectId: newConnectionId,
        currentSocketId: socketId,
        userStatus: 'active',
    };

    supports.add(newSupport);
    return;
};

export const getAllConnectedSupports = async () => {
    return supports;
};


// Send or receive messages within the support chat


// Track and update the status of a message (e.g., sent, delivered, read) in the support chat