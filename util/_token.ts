import { IPayload, } from '../Types/verification';
// import { LOGIN_EXPIRE, } from '../constants/commonConstants';

import { jwtSign, jwtVerify, } from '../util';
interface IVerifyToken {
    _id: string;
    email: string;
    organisation?: string;
    iat?: number;
}

interface ICreateToken extends Omit<IVerifyToken, 'iat'> {
    accessToken: string;
}

export const _verifyToken = (token: string): IVerifyToken => {
    return jwtVerify(token);
};

export const _createToken = (data: any, expire?: string): ICreateToken => {
    const payload: IPayload = {
        _id: data.id,
        email: data.email,
        year: data.year,
    };

    data?.organisation && (payload.organisation = data.organisation);

    const accessToken = jwtSign(payload, expire);
    return {
        ...payload,
        accessToken: accessToken,
    };
};