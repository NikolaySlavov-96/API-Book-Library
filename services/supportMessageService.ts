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

    if (!result) {
        return { state: !!result, role: '', };
    }

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
    const updateUserStatus = await db.UserSessionData.findOne({ where: { currentSocketId: socketId, }, });
    if (updateUserStatus) {
        newSocketId ? updateUserStatus.currentSocketId = newSocketId : null;
        updateUserStatus.userStatus = status;
        await db.UserSessionData.update(updateUserStatus.dataValues, {
            where: { currentSocketId: socketId, },
        });
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