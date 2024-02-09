require("dotenv").config();
const jwt = require('jsonwebtoken');


exports.createLink = (user, condition) => {
    const token = createToken(user, condition);

    const objectWithCondition = {
        "verify": (token) => `/auth/verify/${token}`,
    }

    return `${process.env.WEB_URI}${objectWithCondition[condition](token)}`
};

const createToken = (user, condition) => {
    const secretNew = process.env.JWT_SECRETS + user.email + condition;
    const payload = {
        email: user.email,
    };
    if (condition === "verify") {
        accessToken = jwt.sign(payload, secretNew);
        return accessToken
    }

    // accessToken = jwt.sign(payload, secretNew, { expiresIn: '15m' });
    // return accessToken;
};