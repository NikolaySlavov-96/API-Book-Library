import { MESSAGES, RESPONSE_STATUS_CODE, } from '../constants';

import { createToken, updateMessage, UUID, } from '../util';
// Imported from the concrete module (not the Helpers barrel) to avoid a cyclic
// import: tokenHelpers -> refreshTokenService -> Helpers/index -> tokenHelpers.
import { calculateTimeDifference, } from '../Helpers/_Date';

import db from '../Model';
import RefreshTokenModel from '../Model/RefreshTokenModel';

// Token lifetimes. Access tokens are short-lived; the refresh token keeps the
// session alive and is rotated on every use.
export const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = 7;
const REFRESH_TOKEN_UNIT = 'days';

// Persist a new opaque refresh token for the given identity and return it.
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

// Revoke a single refresh token (used on logout). Best-effort, never throws.
export const revokeRefreshToken = async (token?: string) => {
    if (!token) {
        return;
    }
    await RefreshTokenModel.updateOne({ token, }, { status: true, });
};

// Validate the presented refresh token and, if good, rotate it: the old token
// is revoked and a brand new access + refresh pair is minted. The response
// mirrors the login payload so the client can reuse the same handling.
export const rotateRefreshToken = async (token?: string) => {
    if (!token) {
        return updateMessage(MESSAGES.INVALID_AUTHORIZE_TOKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    const stored = await RefreshTokenModel.findOne({ token, });
    if (!stored || stored.status) {
        return updateMessage(MESSAGES.INVALID_AUTHORIZE_TOKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    const tokenAge = calculateTimeDifference(stored.createdAt, stored.unit || REFRESH_TOKEN_UNIT);
    if (tokenAge >= stored.expireAt) {
        await RefreshTokenModel.updateOne({ token, }, { status: true, });
        return updateMessage(MESSAGES.EXPIRED_TOKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    const user = await db.User.findOne({
        where: { id: stored.userId, },
        raw: true,
        nest: true,
    });
    if (!user || user.isDelete) {
        await RefreshTokenModel.updateOne({ token, }, { status: true, });
        return updateMessage(MESSAGES.INVALID_USER, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    // Rotation: consume the presented token and mint a fresh pair.
    await RefreshTokenModel.updateOne({ token, }, { status: true, });
    const accessToken = createToken(user, ACCESS_TOKEN_TTL);
    const refreshToken = await issueRefreshToken(user.id);

    return updateMessage(MESSAGES.SUCCESSFULLY_LOGIN, RESPONSE_STATUS_CODE.OK, {
        ...accessToken,
        refreshToken,
    });
};
