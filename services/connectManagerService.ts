import { generateDateForDB } from '../Helpers';
import { repositories } from '../repositories';

import { authProvider } from './auth';

export const registerNewVisitor = async (socketId: string, token?: string) => {
    const payload = token ? await authProvider.verifyAccessToken(token) : null;
    const hasPayload = payload && '_id' in payload;

    const currentTime = generateDateForDB();
    return repositories.session.create({
        connectId: socketId,
        connectedAt: currentTime,
        userId: hasPayload ? Number(payload?._id) : null,
    });
};

export const setUserInactive = async (connectId: string) => {
    const currentTime = generateDateForDB();
    await repositories.session.updateByConnectId(connectId, { disconnectedAt: currentTime });
};

export const validateConnectionId = async (data: { connectId: string }) => {
    return repositories.session.findByConnectIdWithUser(data.connectId);
};
