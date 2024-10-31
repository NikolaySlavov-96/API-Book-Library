import { generateDateForDB, } from '../Helpers';

import db from '../Model';

import { UUID, } from '../util';

export const registerNewVisitor = async (socketId) => {
    const newConnectionId = UUID();
    const result = await db.SessionModel.create({
        connectId: socketId,
        unId: newConnectionId,
    });
    return result;
};

export const setUserInactive = async (socketId) => {
    const query = {
        where: {
            connectId: socketId,
        },
        raw: true,
        nest: true,
    };

    // const currentTime = generateDateForDB();
    // const updateUserStatus = {
    //     // disconnectedAt: currentTime.toString(),
    // };

    // return await db.SessionModel.update(updateUserStatus, query);
};

export const validateConnectionId = async (data) => {
    const result = await db.SessionModel.findOne({
        where: { connectId: data.connectId, },
        include: [{
            model: db.User,
            require: false,
            attributes: ['id', 'role', 'email'],
        }],
        raw: true,
        nest: true,
    });

    return result;
};

export const renewConnection = async (data: { unId: string, token?: string }, connectId) => {
    if (data.token) {
        // const payload = await verifyToken(data.token);
    }
    const query = {
        where: {
            unId: data.unId,
        },
        raw: true,
        nest: true,
    };

    const updateUserStatus = {
        connectId,
    };
    return await db.SessionModel.update(updateUserStatus, query);
};