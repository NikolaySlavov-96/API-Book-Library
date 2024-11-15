import { IPayload, } from '../Types/verification';

import { jwtSign, jwtVerify, } from '../util';
interface IVerifyToken {
    _id: string;
    email: string;
    iat?: number;
}

export const _verifyToken = (token: string): IVerifyToken => {
    return jwtVerify(token);
};

export const _createToken = (data: any, expire?: string) => {
    const payload: IPayload = {
        _id: data.id,
        email: data.email,
        year: data.year,
        isVerify: data.isVerify,
        role: data.role,
    };

    const accessToken = jwtSign(payload, expire);
    return {
        ...payload,
        accessToken: accessToken,
    };
};