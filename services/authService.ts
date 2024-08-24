import 'dotenv/config';

import { cryptCompare, cryptHash, db, updateMessage, } from '../util';
import { MESSAGES, TABLE_NAME, } from '../constants';
import { addTokenResponse, } from '../Helpers';

// Address for verify Email
// change password
// BlackListTokenModel

export async function register(query) {
    query.email = query.email.toLowerCase();

    const existingEmail = await db(TABLE_NAME.USER).findOne({ where: { email: query.email, }, });

    if (existingEmail) {
        return updateMessage(MESSAGES.EMAIL_IS_ALREADY_TAKEN, 400);
    }

    const hashedPassword = await cryptHash(query.password);

    await db(TABLE_NAME.USER).create({
        email: query.email,
        password: hashedPassword,
        year: query.year,
    });

    return updateMessage(MESSAGES.SUCCESSFULLY_REGISTER);
}

export async function login(body) {
    const existingEmail = await db(TABLE_NAME.USER).findOne({ where: { email: body.email, }, });

    if (!existingEmail) {
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD);
    }
    if (existingEmail.isDelete) {
        return updateMessage(MESSAGES.DELETED_PROFILE);
    }

    const { stayLogin, password, } = body;
    const matchPassword = await cryptCompare(password, existingEmail.password);

    if (!matchPassword) {
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD);
    }

    return addTokenResponse(existingEmail, MESSAGES.S);
}

export async function logout(token) {
    console.log(token);
    // const request = await BlackListTokenModel.create({
    // inActivateToken: token,
    // });
    return ('Success logout');
}

export async function checkFieldInDB(email) {
    const existingEmail = await db(TABLE_NAME.USER).findAndCountAll({ where: { email, }, });
    return existingEmail.rows.length ? true : false;
}

export async function verifyTokenFormUser(isVerify) {

    const existingEmail = await db(TABLE_NAME.USER).findOne({ where: { email: isVerify.email, }, });
    if (!existingEmail) {
        return updateMessage(MESSAGES.EMAIL_DOES_NOT_EXIST, 402);
    }
    if (existingEmail.isVerify) {
        return updateMessage(MESSAGES.ACCOUNT_ALREADY_TAKEN, 401);
    }
    existingEmail.isVerify = true;
    const result = await existingEmail.save();
    return result.isVerify;
}