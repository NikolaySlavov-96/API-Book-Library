import 'dotenv/config';

import { cryptCompare, cryptHash, updateMessage, UUID, } from '../util';
import { MESSAGES, } from '../constants';
import { addTokenResponse, } from '../Helpers';

import db from '../Model';

// Address for verify Email
// change password
// BlackListTokenModel

export const register = async (query) => {
    query.email = query.email.toLowerCase();

    const existingEmail = (await db.User.findOne({ where: { email: query.email, }, }))?.dataValues;

    if (existingEmail) {
        return updateMessage(MESSAGES.EMAIL_IS_ALREADY_TAKEN, 400);
    }

    const hashedPassword = await cryptHash(query.password);
    const userData = await db.User.create({
        email: query.email,
        password: hashedPassword,
        year: query.year,
    });

    const newConnectionId = UUID();
    await db.UserSessionData.create({
        connectId: newConnectionId,
        currentSocketId: query?.currentSocketId || '',
        userId: userData.id,
    });

    return updateMessage(MESSAGES.SUCCESSFULLY_REGISTER);
};

export const login = async (body) => {
    const existingEmail = await db.User.findOne({
        where: { email: body.email, },
        include: [{
            model: db.UserSessionData,
            require: false,
            attributes: ['id', 'connectId'],
        }],
        raw: true,
        nest: true,
    });

    if (!existingEmail) {
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD, 400);
    }
    if (existingEmail.isDelete) {
        return updateMessage(MESSAGES.DELETED_PROFILE, 400);
    }

    const { stayLogin, password, } = body;
    const matchPassword = await cryptCompare(password, existingEmail.password);

    if (!matchPassword) {
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD, 400);
    }

    return addTokenResponse(existingEmail, MESSAGES.SUCCESSFULLY_LOGIN);
};

export const logout = async (token) => {
    console.log(token);
    // const request = await BlackListTokenModel.create({
    // inActivateToken: token,
    // });
    return ('Success logout');
};

export const checkFieldInDB = async (email) => {
    const existingEmail = (await db.User.findAndCountAll({ where: { email, }, })).dataValues; // TODO Verify
    return existingEmail.rows.length ? true : false;
};

export const verifyTokenFormUser = async (isVerify) => {

    const existingEmail = await db.User.findOne({ where: { email: isVerify.email, }, });

    if (!existingEmail?.dataValues) {
        return updateMessage(MESSAGES.EMAIL_DOES_NOT_EXIST, 402);
    }
    if (existingEmail?.dataValues?.isVerify) {
        return updateMessage(MESSAGES.ACCOUNT_ALREADY_TAKEN, 401);
    }

    existingEmail.isVerify = true;
    await existingEmail.save();

    return updateMessage(MESSAGES.SUCCESSFULLY_VERIFY_ACCOUNT, 200);
};
