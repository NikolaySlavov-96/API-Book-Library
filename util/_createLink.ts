import { jwtSign, } from '.';

export default (user, condition) => {
    const token = createToken(user, condition);

    const objectWithCondition = {
        'verify': (token) => `/auth/verify/${token}`,
    };

    return `${process.env.WEB_URI}${objectWithCondition[condition](token)}`;
};

const createToken = (user, condition) => {
    // const secretNew = process.env.JWT_SECRETS + user.email + condition;
    const payload = {
        email: user.email,
    };
    if (condition === 'verify') {
        const accessToken = jwtSign(payload);
        return accessToken;
    }

    // accessToken = jwt.sign(payload, secretNew, { expiresIn: '15m' });
    // return accessToken;
};