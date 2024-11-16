import { generateDateForDB, } from '../Helpers';

import db from '../Model';

import { verifyToken, } from '../util';

export const registerNewVisitor = async (socketId, token?: string) => {
    const payload = token ? await verifyToken(token) : null;
    const hasPayload = payload && '_id' in payload;

    const currentTime = generateDateForDB();
    const result = await db.SessionModel.create({
        connectId: socketId,
        connectedAt: currentTime,
        userId: hasPayload ? payload?._id : null,
    });
    return result;
};

export const setUserInactive = async (connectId: string) => {
    const query = {
        where: {
            connectId: connectId,
        },
        raw: true,
        nest: true,
    };

    const currentTime = generateDateForDB();
    const updateUserStatus = {
        disconnectedAt: currentTime,
    };

    return await db.SessionModel.update(updateUserStatus, query);
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