import { createToken, updateMessage, } from '../util';
import { ACCESS_TOKEN_TTL, issueRefreshToken, } from '../services/refreshTokenService';

// Issues the initial token pair on login: a short-lived access token plus a
// persisted, rotatable refresh token. The refresh token rides along inside
// `userInfo` so the client stores it next to the access token.
export const _addTokenResponse = async (data: any, response) => {
    const accessToken = createToken(data, ACCESS_TOKEN_TTL);
    const refreshToken = await issueRefreshToken(data.id);

    return updateMessage(response, 0, { ...accessToken, refreshToken, });
};
