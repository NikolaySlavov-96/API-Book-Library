import { verifyToken } from '../../util';

import { type IAuthProvider, type TVerifyResult } from './AuthProvider';

export const localJwtProvider: IAuthProvider = {
    verifyAccessToken: async (token: string): Promise<TVerifyResult> => {
        return verifyToken(token);
    },
};
