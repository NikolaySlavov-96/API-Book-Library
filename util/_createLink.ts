import { generateEmailToken } from '../services/tokenService';

import { UUID } from '.';

export default async (user, condition) => {
    const token = await createToken(user, condition);

    // TODO(lint): rename inner `token` param to avoid shadowing outer scope (no-shadow).
    const objectWithCondition = {
        verify: (token) => `/auth/verify/${token}`,
        magic: (token) => `/auth/magic/${token}`,
    };

    return `${process.env.WEB_URI}${objectWithCondition[condition](token)}`;
};

const createToken = async (user, condition) => {
    const tokenId = UUID();
    const payload = {
        address: user.email,
        token: tokenId,
    };
    if (condition === 'verify' || condition === 'magic') {
        await generateEmailToken(payload, 15, 'minute');
        return tokenId;
    }

    return undefined;
};
