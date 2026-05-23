import { MESSAGES, RESPONSE_STATUS_CODE } from '../constants';
import { calculateTimeDifference } from '../Helpers/_Date';
import db from '../Model';
import RefreshTokenModel from '../Model/RefreshTokenModel';
import { createToken, updateMessage, UUID } from '../util';

export const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = 7;
const REFRESH_TOKEN_UNIT = 'days';

export const issueRefreshToken = async (userId: number | string): Promise<string> => {
    const token = UUID();
    await RefreshTokenModel.create({
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
    await RefreshTokenModel.updateOne({ token }, { status: true });
};

export const rotateRefreshToken = async (token?: string) => {
    if (!token) {
        return updateMessage(MESSAGES.INVALID_AUTHORIZE_TOKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    const stored = await RefreshTokenModel.findOne({ token });
    if (!stored || stored.status) {
        return updateMessage(MESSAGES.INVALID_AUTHORIZE_TOKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    const tokenAge = calculateTimeDifference(stored.createdAt, stored.unit || REFRESH_TOKEN_UNIT);
    if (tokenAge >= stored.expireAt) {
        await RefreshTokenModel.updateOne({ token }, { status: true });
        return updateMessage(MESSAGES.EXPIRED_TOKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    const user = await db.User.findOne({
        where: { id: stored.userId },
        raw: true,
        nest: true,
    });
    if (!user || user.isDelete) {
        await RefreshTokenModel.updateOne({ token }, { status: true });
        return updateMessage(MESSAGES.INVALID_USER, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    await RefreshTokenModel.updateOne({ token }, { status: true });
    const accessToken = createToken(user, ACCESS_TOKEN_TTL);
    const refreshToken = await issueRefreshToken(user.id);

    return updateMessage(MESSAGES.SUCCESSFULLY_LOGIN, RESPONSE_STATUS_CODE.OK, {
        ...accessToken,
        refreshToken,
    });
};
