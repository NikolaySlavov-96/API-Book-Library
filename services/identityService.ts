import 'dotenv/config';

import { MESSAGES, RESPONSE_STATUS_CODE } from '../constants';
import { repositories } from '../repositories';
import { cryptCompare, cryptHash, updateMessage } from '../util';

import { revokeRefreshToken } from './refreshTokenService';
import { _addTokenResponse as addTokenResponse } from './tokenResponseService';

// Identity / authentication service.
// Everything here is a candidate to be replaced by an external auth provider.
// It deliberately knows nothing about profile data beyond creating the initial
// profile row on registration.

export const register = async (query) => {
    const email = query.email.toLowerCase();

    const existingEmail = await repositories.user.findByEmail(email);

    if (existingEmail) {
        return updateMessage(MESSAGES.EMAIL_IS_ALREADY_TAKEN, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }

    const hashedPassword = await cryptHash(query.password);
    const user = await repositories.user.create({
        email,
        password: hashedPassword,
    });

    // Seed the application-owned profile for the new identity.
    await repositories.profile.create({
        userId: user.id,
        year: query.year,
    });

    return updateMessage(MESSAGES.SUCCESSFULLY_REGISTER);
};

export const login = async (body) => {
    const existingEmail = await repositories.user.findByEmail(body.email);

    if (!existingEmail) {
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }
    if (existingEmail.isDelete) {
        return updateMessage(MESSAGES.DELETED_PROFILE, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }

    const matchPassword = await cryptCompare(body.password, existingEmail.password ?? '');
    if (!matchPassword) {
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }

    return addTokenResponse(existingEmail, MESSAGES.SUCCESSFULLY_LOGIN);
};

export const loginViaMagic = async (email) => {
    const existingEmail = await repositories.user.findByEmail(email);

    if (!existingEmail) {
        return updateMessage(MESSAGES.WRONG_EMAIL_OR_PASSWORD, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }
    if (existingEmail.isDelete) {
        return updateMessage(MESSAGES.DELETED_PROFILE, RESPONSE_STATUS_CODE.BAD_REQUEST);
    }
    if (!existingEmail.isVerify) {
        // 403, not 401: the credentials are valid but the account isn't verified.
        // 401 is reserved for an expired/invalid access token so the client's
        // refresh-on-401 flow isn't triggered by a domain error like this one.
        return updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY, RESPONSE_STATUS_CODE.FORBIDDEN);
    }

    return addTokenResponse(existingEmail, MESSAGES.SUCCESSFULLY_LOGIN);
};

export const logout = async (data) => {
    await revokeRefreshToken(data?.refreshToken);
};

export const checkFieldInDB = async (email) => {
    const total = await repositories.user.countByEmail(email);
    return total > 0;
};

export const verifyTokenFormUser = async (address) => {
    const existingEmail = await repositories.user.findByEmail(address);
    if (!existingEmail) {
        return updateMessage(MESSAGES.EMAIL_DOES_NOT_EXIST, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }
    if (existingEmail.isVerify) {
        return updateMessage(MESSAGES.ACCOUNT_ALREADY_TAKEN, RESPONSE_STATUS_CODE.UNAUTHORIZED);
    }

    await repositories.user.markVerified(existingEmail.id);

    return updateMessage(MESSAGES.SUCCESSFULLY_VERIFY_ACCOUNT, RESPONSE_STATUS_CODE.OK);
};
