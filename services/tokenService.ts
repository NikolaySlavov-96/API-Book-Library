import { MESSAGES, RESPONSE_STATUS_CODE } from '../constants';
import { calculateTimeDifference } from '../Helpers';
import { repositories } from '../repositories';
import { updateMessage } from '../util';

const DEFAULT_UNIT = 'minute';

export const verifyEmailToken = async (token: string) => {
    const isExistToken = await repositories.verifyToken.findByToken(token);
    if (!isExistToken) {
        return updateMessage(MESSAGES.TOKEN_DOES_NOT_EXIST, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    if (isExistToken.status) {
        return updateMessage(MESSAGES.TOKEN_USER, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    const tokenAge = calculateTimeDifference(isExistToken.createdAt, isExistToken.unit || DEFAULT_UNIT);
    const isValidToken = tokenAge < isExistToken.expireAt;
    if (!isValidToken) {
        return updateMessage(MESSAGES.EXPIRED_TOKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    return isExistToken;
};

export const verifyMagicToken = async (token: string) => {
    return verifyEmailToken(token);
};

interface IGenerateEmailToken {
    token: string;
    address: string;
}
export const generateEmailToken = async (data: IGenerateEmailToken, expireAt: number, unit: 'minute') => {
    return repositories.verifyToken.create({ ...data, expireAt, unit });
};

export const changeEmailTokenStatus = async (token: string) => {
    return repositories.verifyToken.markUsed(token);
};
