import { sign, verify, } from 'jsonwebtoken';

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

import { IPayload, } from '../Types/verification';


const jwtVerify = (token: string): any => {
    if (!JWT_SECRET) {
        throw ('Missing token');
    }
    return verify(token, JWT_SECRET);
};

const jwtSign = (payload, expires?: string): any => {
    if (!JWT_SECRET) {
        throw ('Missing token');
    }
    return sign(payload, JWT_SECRET, expires && { expiresIn: expires, });
};


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