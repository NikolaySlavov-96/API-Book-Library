import { EMAIL, MESSAGES, RESPONSE_STATUS_CODE } from '../constants';
import * as identityService from '../services/identityService';
import verifyAccount from '../services/mailService';
import * as refreshTokenService from '../services/refreshTokenService';
import * as tokenService from '../services/tokenService';
import { updateMessage } from '../util';

export const createUser = async (req, res, next) => {
    try {
        const { body } = req;

        const result = await identityService.register(body);

        if (result.statusCode) {
            res.status(result.statusCode).json(result.user);
            return;
        }

        const emailData = [{ type: EMAIL.REGISTER_CONFIRM }];
        void verifyAccount({ email: req.body.email }, emailData);

        res.status(201).json(result.user);
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const token = await identityService.login(req.body);
        res.status(token?.statusCode || RESPONSE_STATUS_CODE.OK).json(token?.user || token);
    } catch (err) {
        next(err);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        const result = await refreshTokenService.rotateRefreshToken(refreshToken);
        res.status(result?.statusCode || RESPONSE_STATUS_CODE.OK).json(result?.user || result);
    } catch (err) {
        next(err);
    }
};

export const exitUser = async (req, res, next) => {
    try {
        await identityService.logout(req.body);
        res.status(RESPONSE_STATUS_CODE.NO_CONTENT);
    } catch (err) {
        next(err);
    }
};

export const checkFields = async (req, res, next) => {
    const { email } = req.query;
    try {
        const result = await identityService.checkFieldInDB(email);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const requestMagicLink = async (req, res, next) => {
    try {
        const { email } = req.body;

        const emailExists = await identityService.checkFieldInDB(email);
        if (emailExists) {
            const emailData = [{ type: EMAIL.MAGIC_LINK }];
            void verifyAccount({ email }, emailData);
        }

        // Always respond 200 to avoid leaking which emails are registered
        res.status(RESPONSE_STATUS_CODE.OK).json(updateMessage(MESSAGES.PLEASE_VISIT_YOU_EMAIL).user);
    } catch (err) {
        next(err);
    }
};

export const verifyMagicLink = async (req, res, next) => {
    try {
        const { token } = req.body;

        const tokenResult = await tokenService.verifyMagicToken(token);
        if ('statusCode' in tokenResult) {
            res.status(tokenResult.statusCode).json(tokenResult.user);
            return;
        }

        const email = 'address' in tokenResult && tokenResult.address;

        await tokenService.changeEmailTokenStatus(token);

        const loginResult = await identityService.loginViaMagic(email);
        res.status(loginResult?.statusCode || RESPONSE_STATUS_CODE.OK).json(loginResult?.user || loginResult);
    } catch (err) {
        next(err);
    }
};

export const verifyUser = async (req, res, next) => {
    try {
        const { verifyToken } = req.body;
        const userAddress = await tokenService.verifyEmailToken(verifyToken);
        if ('statusCode' in userAddress) {
            res.status(userAddress?.statusCode).json(userAddress?.user);
            return;
        }

        const userAddressValue = 'address' in userAddress && userAddress.address;
        const verifyState = await identityService.verifyTokenFormUser(userAddressValue);

        await tokenService.changeEmailTokenStatus(verifyToken);

        res.status(verifyState?.statusCode).json(verifyState?.user);
    } catch (err) {
        next(err);
    }
};
