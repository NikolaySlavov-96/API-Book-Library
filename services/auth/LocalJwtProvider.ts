import { verifyToken } from '../../util';

import { type IAuthProvider, type TVerifyResult } from './AuthProvider';

export const localJwtProvider: IAuthProvider = {
    // TODO(lint): drop `async` — the body has no `await` (require-await).
    verifyAccessToken: async (token: string): Promise<TVerifyResult> => {
        return verifyToken(token);
    },
};
