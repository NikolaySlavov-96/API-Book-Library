import db from '../Model';
import { updateMessage, UUID, } from '../util';

type TUserStatus = 'active' | 'inactive';

// IN DB with messages save all messages by connectionId
// Auth and UserSessionData tables have the relation 
interface IUserData {
    connectId: string;
    currentSocketId: string;
    userStatus: TUserStatus;
    role?: string;
}

const supports = new Set<IUserData>();

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

    const userData = {
        connectId: newConnectionId,
        currentSocketId: socketId,
        userStatus: 'active',
        userId: result ? result.User.id : null,
    };

    await db.UserSessionData.create(userData);

    return userData;
};

interface IChangeUserStatus {
    socketId: string | undefined;
    userSessionId?: string;
    status: TUserStatus;
    newSocketId?: string;
}
export const changeUserStatus = async ({ socketId, userSessionId, status, newSocketId, }: IChangeUserStatus) => {
    const query = { where: {}, };
    socketId ? query.where = { currentSocketId: socketId, } : query.where = { id: userSessionId, };

    const updateUserStatus = await db.UserSessionData.findOne(query);
    if (updateUserStatus) {
        newSocketId ? updateUserStatus.currentSocketId = newSocketId : null;
        updateUserStatus.userStatus = status;
        await db.UserSessionData.update(updateUserStatus.dataValues, query);

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

export const leaveSupportChat = async () => {

};

export const getAllConnectedSupports = async () => {
    return supports;
};



// Send or receive messages within the support chat


// Track and update the status of a message (e.g., sent, delivered, read) in the support chat