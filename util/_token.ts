import jwt from 'jsonwebtoken';
const { sign, verify } = jwt;

const { JWT_SECRET } = process.env;

import { type IPayload } from '../Types/verification';

type TExpire = jwt.SignOptions['expiresIn'];

// TODO(lint): replace `any` return with a proper JWT payload type (no-explicit-any).
// TODO(lint): throw a real Error instance instead of a string literal (only-throw-error).
const jwtVerify = (token: string): any => {
    if (!JWT_SECRET) {
        throw 'Missing token';
    }
    return verify(token, JWT_SECRET);
};

// TODO(lint): type `payload` and the return value (no-explicit-any).
// TODO(lint): throw a real Error instance instead of a string literal (only-throw-error).
const jwtSign = (payload, expires?: TExpire): any => {
    if (!JWT_SECRET) {
        throw 'Missing token';
    }
    return sign(payload, JWT_SECRET, expires && { expiresIn: expires });
};

interface IVerifyToken {
    _id: string;
    email: string;
    isVerify: boolean;
    role: string;
    iat?: number;
}

export const _verifyToken = (token: string): IVerifyToken | { error: string } => {
    try {
        return jwtVerify(token);
    } catch (err) {
        return { error: err };
    }
};

// TODO(lint): type `data` (no-explicit-any) — expected shape: { id, email, isVerify, role }.
export const _createToken = (data: any, expire?: TExpire) => {
    // Identity claims only. `year` is profile data and is fetched via /profile.
    const payload: IPayload = {
        _id: data.id,
        email: data.email,
        isVerify: data.isVerify,
        role: data.role,
    };

    const accessToken = jwtSign(payload, expire);
    return {
        ...payload,
        accessToken,
    };
};
