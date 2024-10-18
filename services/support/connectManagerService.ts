import db from '../../Model';
import { UUID, } from '../../util';

type TUserStatus = 'active' | 'inactive' | 'free' | 'busy' | 'waiting';
type TUserRole = 'user' | 'support';

interface IAllConnectedUsers {
    role: TUserRole;
    connectId?: string;
    currentSocketId: string;
    status: TUserStatus;
}

interface IUpdateSocketIdInDB {
    connectId: string;
    newSocketId?: string;
}

const allConnectedUsers: IAllConnectedUsers[] = [];

export const appendVisitorToList = async (socketId: string) => {
    const newVisitor: IAllConnectedUsers = {
        currentSocketId: socketId,
        role: 'user',
        status: 'active',
    };

    allConnectedUsers.push(newVisitor);
};

export const removeVisitorFromList = async (socketId) => {
    const isInChat = allConnectedUsers.find(u => u.currentSocketId === socketId);
    if (isInChat.status === 'waiting') {
        // Notify admins for entrance user
    }
    isInChat.status = 'inactive';
};

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
            attributes: ['id'],
        }],
    });

    const newConnectionId = UUID();
    const userData = {
        connectId: newConnectionId,
        currentSocketId: socketId,
        userId: result?.User ? result.User.id : null,
    };

    await db.UserSessionData.create(userData);

    return userData;
};

const updateSocketIdInDB = async ({ connectId, newSocketId, }: IUpdateSocketIdInDB) => {
    const query = {
        where: {
            connectId: connectId,
        },
        include: [{
            model: db.User,
            require: false,
            attributes: ['id', 'role'],
        }],
        raw: true,
        nest: true,
    };

    const updateUserStatus = {
        currentSocketId: newSocketId,
    };

    return await db.UserSessionData.update(updateUserStatus, query);
};

export const linkSocketIdToConnectionId = async (data: { currentSocketId: string, connectId: string }) => {
    await updateSocketIdInDB({ connectId: data.connectId, newSocketId: data.currentSocketId, });
    allConnectedUsers.filter(c => c.currentSocketId === data.currentSocketId ? c.connectId = data.connectId : c);
};

export const assignRoleAndStatusToUser = async (data: { connectId: string, role: TUserRole, status: TUserStatus }) => {
    allConnectedUsers.filter(u =>
        u.connectId === data.connectId ?
            (u.role = data.role, u.status = data.status) : u);
};

export const getAllConnectedSupports = async ({ status, }: { status: TUserStatus }) => {
    return allConnectedUsers.filter(s => s.role === 'support' && s.status === status);
};

export const getAllConnectedUsers = async ({ status, }: { status: TUserStatus }) => {
    return allConnectedUsers.filter(u => u.role === 'user' && u.status === status);
};

export const isUserInQueue = async (data: { connectId: string }) => {
    return allConnectedUsers.find(u => u.connectId === data.connectId && u.role === 'user');
};

export const setStatus = async (data: { connectId: string }, status: TUserStatus) => {
    allConnectedUsers.filter(s => s.connectId === data.connectId ? s.status = status : s);
};