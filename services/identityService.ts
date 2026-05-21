import 'dotenv/config';

import { MESSAGES, RESPONSE_STATUS_CODE, } from '../constants';

import { cryptCompare, cryptHash, updateMessage, } from '../util';
import { addTokenResponse, generateDateForDB, } from '../Helpers';

import db from '../Model';

// Identity / authentication service.
// Everything here is a candidate to be replaced by an external auth provider.
// It deliberately knows nothing about profile data beyond creating the initial
// profile row on registration.

export const register = async (query) => {
    query.email = query.email.toLowerCase();

    const existingEmail = (await db.User.findOne({ where: { email: query.email, }, }))?.dataValues;

    if (existingEmail) {
        return updateMessage(MESSAGES.EMAIL_IS_ALREADY_TAKEN, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }

    const hashedPassword = await cryptHash(query.password);
    const user = await db.User.create({
        email: query.email,
        password: hashedPassword,
    });

    // Seed the application-owned profile for the new identity.
    await db.Profile.create({
        userId: user.id,
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
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }
    if (existingEmail.isDelete) {
        return updateMessage(MESSAGES.DELETED_PROFILE, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }

    const { password, connectId, } = body;

    const matchPassword = await cryptCompare(password, existingEmail.password);
    if (!matchPassword) {
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD, RESPONSE_STATUS_CODE.BAD_REQUEST);
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

export const loginViaMagic = async (email) => {
    const existingEmail = await db.User.findOne({
        where: { email, },
        raw: true,
        nest: true,
    });

    if (!existingEmail) {
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }
    if (existingEmail.isDelete) {
        return updateMessage(MESSAGES.DELETED_PROFILE, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }
    if (!existingEmail.isVerify) {
        return updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    return addTokenResponse(existingEmail, MESSAGES.SUCCESSFULLY_LOGIN);
};

export const logout = async (data) => {
    if (data?.connectId) {
        const currentTime = generateDateForDB();
        await db.SessionModel.update({ disconnectedAt: currentTime, }, {
            where: { connectId: data.connectId, },
            raw: true,
            nest: true,
        });
    }

    return;
};

export const checkFieldInDB = async (email) => {
    const existingEmail = (await db.User.findAndCountAll({ where: { email, }, })).dataValues;
    return existingEmail.rows.length ? true : false;
};

export const verifyTokenFormUser = async (address) => {
    const existingEmail = await db.User.findOne({ where: { email: address, }, });
    if (!existingEmail?.dataValues) {
        return updateMessage(MESSAGES.EMAIL_DOES_NOT_EXIST, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }
    if (existingEmail?.dataValues?.isVerify) {
        return updateMessage(MESSAGES.ACCOUNT_ALREADY_TAKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    existingEmail.isVerify = true;
    await existingEmail.save();

    return updateMessage(MESSAGES.SUCCESSFULLY_VERIFY_ACCOUNT, RESPONSE_STATUS_CODE.OK);
};
