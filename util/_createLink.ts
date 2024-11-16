import { UUID, } from '.';

import { generateEmailToken, } from '../services/tokenService';

export default async (user, condition) => {
    const token = await createToken(user, condition);

    const objectWithCondition = {
        'verify': (token) => `/auth/verify/${token}`,
    };

    return `${process.env.WEB_URI}${objectWithCondition[condition](token)}`;
};

const createToken = async (user, condition) => {
    const tokenId = UUID();
    const payload = {
        address: user.email,
        token: tokenId,
    };
    if (condition === 'verify') {
        return await generateEmailToken(payload, 15, 'minute');
    }
};