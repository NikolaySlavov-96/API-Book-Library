import { verifyToken, } from '../../util';

import { IAuthProvider, TVerifyResult, } from './AuthProvider';

// Current implementation: tokens are issued and verified locally (HS256 JWT).
// When migrating to a hosted provider, add a sibling adapter (e.g.
// `ProviderJwksProvider.ts`) that verifies the provider's JWT against its JWKS
// and maps `sub`/`email`/claims onto IAuthIdentity, then switch ./index.ts.
export const localJwtProvider: IAuthProvider = {
    verifyAccessToken: async (token: string): Promise<TVerifyResult> => {
        return verifyToken(token);
    },
};
