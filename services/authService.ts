import 'dotenv/config';

import { MESSAGES, RESPONSE_STATUS_CODE, SYSTEM_FILE_DIRECTORY, } from '../constants';

import { cryptCompare, cryptHash, updateMessage, } from '../util';
import { addTokenResponse, generateDateForDB, } from '../Helpers';

import db from '../Model';
import { registerNewVisitor, } from './connectManagerService';

const { BE_URL, } = process.env;
const AVATAR_PATH = BE_URL + SYSTEM_FILE_DIRECTORY.UPLOAD + '/';

const PROFILE_FIELDS = ['id', 'email', 'year', 'role', 'isVerify', 'readingGoal', 'displayName', 'notifyByEmail'];

const serializeProfile = (user) => {
    const avatar = user?.avatar;

    return {
        id: user.id,
        email: user.email,
        year: user.year,
        role: user.role,
        isVerify: user.isVerify,
        readingGoal: user.readingGoal,
        displayName: user.displayName ?? null,
        notifyByEmail: user.notifyByEmail,
        avatarFileId: user.avatarFileId ?? null,
        avatarUrl: avatar?.uniqueName ? AVATAR_PATH + avatar.uniqueName : null,
        avatarSrc: avatar?.src ?? null,
    };
};

export const getProfile = async (userId) => {
    const user = await db.User.findOne({
        where: { id: userId, },
        attributes: PROFILE_FIELDS.concat(['avatarFileId']),
        include: [
            {
                model: db.File,
                as: 'avatar',
                required: false,
                attributes: ['id', 'src', 'uniqueName'],
            }
        ],
    });

    if (!user) {
        return updateMessage(MESSAGES.INVALID_USER, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    return serializeProfile(user.toJSON());
};

export const updateProfile = async (userId, body) => {
    const user = await db.User.findByPk(userId);
    if (!user) {
        return updateMessage(MESSAGES.INVALID_USER, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    // Allowlist the fields a user may change on their own profile
    if (body.readingGoal !== undefined) {
        user.readingGoal = body.readingGoal;
    }
    if (body.displayName !== undefined) {
        user.displayName = body.displayName?.trim() || null;
    }
    if (body.avatarFileId !== undefined) {
        user.avatarFileId = body.avatarFileId;
    }
    if (body.notifyByEmail !== undefined) {
        user.notifyByEmail = body.notifyByEmail;
    }

    await user.save();

    return await getProfile(userId);
};

export const updateReadingGoal = async (userId, goal) => {
    return await updateProfile(userId, { readingGoal: goal, });
};

// Address for verify Email
// change password
// BlackListTokenModel

export const register = async (query) => {
    query.email = query.email.toLowerCase();

    const existingEmail = (await db.User.findOne({ where: { email: query.email, }, }))?.dataValues;

    if (existingEmail) {
        return updateMessage(MESSAGES.EMAIL_IS_ALREADY_TAKEN, RESPONSE_STATUS_CODE.BAD_REQUEST);
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
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }
    if (existingEmail.isDelete) {
        return updateMessage(MESSAGES.DELETED_PROFILE, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }

    const { stayLogin, password, connectId, } = body;

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

    // const request = await BlackListTokenModel.create({
    // inActivateToken: token,
    // });
    return;
};

export const checkFieldInDB = async (email) => {
    const existingEmail = (await db.User.findAndCountAll({ where: { email, }, })).dataValues; // TODO Verify
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