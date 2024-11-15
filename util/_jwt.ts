import { sign, verify, } from 'jsonwebtoken';

const JWT_SECRET: string | undefined = process.env.JWT_SECRET2;

export const _jwtSign = (payload, expires?: string): any => {
    return sign(payload, JWT_SECRET!, expires && { expiresIn: expires, });
};

export const _jwtVerify = (token: string): any => {
    if (!JWT_SECRET) {
        throw ('Missing token');
    }
    return verify(token, JWT_SECRET);
};

// export const jwtDecoder = (token: string): any => {
//     return jwtDecode(token);
// };