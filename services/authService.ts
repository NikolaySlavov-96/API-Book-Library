// @ts-nocheck
import 'dotenv/config';

import { database, } from '../config';
import { cryptCompare, cryptHash, createToken, } from '../util';

const User = database?.userModel;

// Address for verify Email
// change password
// BlackListTokenModel

export async function register(query) {
    query.email = query.email.toLowerCase();

    const existingEmail = await User.findOne({ where: { email: query.email, }, });

    if (existingEmail) {
        throw new Error('Email is taken');
    }
    const hashedPassword = await cryptHash(query.password);

    const result = await User.create({
        email: query.email,
        password: hashedPassword,
        year: query.year,
    });

    return { message: 'Successfull Register', };
}

export async function login(body) {
    const existingEmail = await User.findOne({ where: { email: body.email, }, });

    if (!existingEmail) {
        throw new Error('Email or Password is not valit');
    }
    const string = existingEmail;
    if (string.isDelete) {
        throw new Error('Profile is delete, contact with administrate');
    }

    const { stayLogin, password, } = body;
    const matchPassword = await cryptCompare(password, string.password);

    if (!matchPassword) {
        throw new Error('Email or Password is not valit');
    }

    return createToken(string, stayLogin);
}

export async function logout(token) {
    console.log(token);
    // const request = await BlackListTokenModel.create({
    // inActivateToken: token,
    // });
    return ('Success logout');
}

export async function checkFieldInDB(email) {
    const existingEmail = await User.findAndCountAll({ where: { email, }, });
    return existingEmail.rows.length ? true : false;
}

export async function verifyTokenFormUser(isVerify) {

    const existingEmail = await User.findOne({ where: { email: isVerify.email, }, });
    if (!existingEmail) {
        return { message: 'Email is not valid', };
    }
    if (existingEmail.isVerify) {
        return { message: 'Account is Verifie', };
    }
    existingEmail.isVerify = true;
    const result = await existingEmail.save();
    return result.isVerify;
}