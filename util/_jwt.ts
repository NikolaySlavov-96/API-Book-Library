import { sign, verify, } from 'jsonwebtoken';
// import { jwtDecode, } from 'jwt-decode';

import { IPayload, } from '../Types/verification';

import { updateMessage, } from '../util';

const JWT_SECRET: string | undefined = process.env.JWT_SECRET;

export const _jwtSign = (payload: IPayload | { security: string }, expires?: string): any => {
    return sign(payload, JWT_SECRET!, expires && { expiresIn: expires, });
};

export const _jwtVerify = (token: string): any => {
    try {
        return verify(token, JWT_SECRET!);

    } catch (error) {
        if (error.message.includes('xpired')) {
            return updateMessage({ message: '22', messageCode: '250', }, 404);
            // return updateMessage(EXPIRED_TOKEN, GLOBAL_ERROR_CODE);
        }

        if (error.message.includes('nvalid')) {
            return updateMessage({ message: '22', messageCode: '250', }, 404);
            // return updateMessage(INVALID_TOKEN, GLOBAL_ERROR_CODE);
        }
        throw (error);
    }
};

// export const jwtDecoder = (token: string): any => {
//     return jwtDecode(token);
// };