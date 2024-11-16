import { MESSAGES, RESPONSE_STATUS_CODE, } from '../constants';

import { updateMessage, } from '../util';

import VerifyTokenModel from '../Model/VerifyTokenModel';

import { calculateTimeDifference, } from '../Helpers';


export const verifyEmailToken = async (token: string) => {
    const isExistToken = await VerifyTokenModel.findOne({ token, });
    if (!isExistToken) {
        return updateMessage(MESSAGES.TOKEN_DOES_NOT_EXIST, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    if (isExistToken.status) {
        return updateMessage(MESSAGES.TOKEN_USER, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    const tokenAge = calculateTimeDifference(isExistToken.createdAt, isExistToken.unit || 'minute');
    const isValidToken = tokenAge < isExistToken.expireAt;
    if (!isValidToken) {
        return updateMessage(MESSAGES.EXPIRED_TOKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    return isExistToken;
};

interface IGenerateEmailToken {
    token: string;
    address: string;
}
export const generateEmailToken = async (data: IGenerateEmailToken, expireAt: number, unit: 'minute') => {
    const newData = { ...data, expireAt, unit, };
    return await VerifyTokenModel.create(newData);
};

export const changeEmailTokenStatus = async (token) => {
    return await VerifyTokenModel.findOneAndUpdate({ token, }, { status: true, });
};