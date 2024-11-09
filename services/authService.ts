import 'dotenv/config';

import { cryptCompare, cryptHash, updateMessage, UUID, } from '../util';
import { MESSAGES, } from '../constants';
import { addTokenResponse, generateDateForDB, } from '../Helpers';

import db from '../Model';
import { registerNewVisitor, } from './connectManagerService';

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
    await db.User.create({
        email: query.email,
        password: hashedPassword,
        year: query.year,
    });

    return updateMessage(MESSAGES.SUCCESSFULLY_REGISTER);
};

export const login = async (body) => {
    const existingEmail = await db.User.findOne({
        where: { email: body.email, },
        raw: true,
        nest: true,
    });

    if (!existingEmail) {
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD, 400);
    }
    if (existingEmail.isDelete) {
        return updateMessage(MESSAGES.DELETED_PROFILE, 400);
    }

    const { stayLogin, password, connectId, } = body;

    const matchPassword = await cryptCompare(password, existingEmail.password);
    if (!matchPassword) {
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD, 400);
    }

    if (connectId) {
        const currentTime = generateDateForDB();
        await db.SessionModel.update({ userId: existingEmail.id, connectedAt: currentTime, }, {
            where: { connectId: connectId, },
            raw: true,
            nest: true,
        });
    }

    return addTokenResponse(existingEmail, MESSAGES.SUCCESSFULLY_LOGIN);
};

export const logout = async (data) => {
    await registerNewVisitor('');

    if (data?.connectId) {
        const currentTime = generateDateForDB();
        await db.SessionModel.update({ disconnectedAt: currentTime, }, {
            where: { connectId: data.connectId, },
            raw: true,
            nest: true,
        });
    }

    // const request = await BlackListTokenModel.create({
    // inActivateToken: token,
    // });
    return;
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
