import { MESSAGES, RESPONSE_STATUS_CODE } from '../constants';
import { calculateTimeDifference } from '../Helpers/_Date';
import { repositories } from '../repositories';
import { createToken, updateMessage, UUID } from '../util';

export const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = 7;
const REFRESH_TOKEN_UNIT = 'days';

export const issueRefreshToken = async (userId: number | string): Promise<string> => {
    const token = UUID();
    await repositories.refreshToken.create({
        token,
        userId: String(userId),
        expireAt: REFRESH_TOKEN_TTL,
        unit: REFRESH_TOKEN_UNIT,
    });

    return token;
};

export const revokeRefreshToken = async (token?: string) => {
    if (!token) {
        return;
    }
    await repositories.refreshToken.markUsed(token);
};

export const rotateRefreshToken = async (token?: string) => {
    if (!token) {
        return updateMessage(MESSAGES.INVALID_AUTHORIZE_TOKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    const stored = await repositories.refreshToken.findByToken(token);
    if (!stored || stored.status) {
        return updateMessage(MESSAGES.INVALID_AUTHORIZE_TOKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    const tokenAge = calculateTimeDifference(stored.createdAt, stored.unit || REFRESH_TOKEN_UNIT);
    if (tokenAge >= stored.expireAt) {
        await repositories.refreshToken.markUsed(token);
        return updateMessage(MESSAGES.EXPIRED_TOKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    const user = await repositories.user.findById(stored.userId);
    if (!user || user.isDelete) {
        await repositories.refreshToken.markUsed(token);
        return updateMessage(MESSAGES.INVALID_USER, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    await repositories.refreshToken.markUsed(token);
    const accessToken = createToken(user, ACCESS_TOKEN_TTL);
    const refreshToken = await issueRefreshToken(user.id);

    return updateMessage(MESSAGES.SUCCESSFULLY_LOGIN, RESPONSE_STATUS_CODE.OK, {
        ...accessToken,
        refreshToken,
    });
};
