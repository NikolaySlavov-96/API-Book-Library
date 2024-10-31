import { generateDateForDB, } from '../Helpers';

import db from '../Model';

export const registerNewVisitor = async (socketId) => {
    const currentTime = generateDateForDB();
    const result = await db.SessionModel.create({
        connectId: socketId,
        connectedAt: currentTime.toString(),
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

    const currentTime = generateDateForDB();
    const updateUserStatus = {
        disconnectedAt: currentTime.toString(),
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