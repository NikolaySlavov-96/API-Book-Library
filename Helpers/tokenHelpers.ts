import { createToken, updateMessage, } from '../util';

export const _addTokenResponse = (data: any, response) => {
    const accessToken = createToken(data, '1m');

    return updateMessage(response, 0, accessToken);
};