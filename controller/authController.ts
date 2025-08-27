import { RESPONSE_STATUS_CODE, } from '../constants';

import * as authService from '../services/authService';
import * as tokenService from '../services/tokenService';

export const createUser = async (req, res, next) => {
    try {
        const body = req.body;

        const result = await authService.register(body);

        if (result.statusCode) {
            res.status(result.statusCode).json(result.user);
            return;
        }

        // const emailData = [{ type: EMAIL.REGISTER_CONFIRM, }];
        // verifyAccount({ email: req.body.email, }, emailData);

        res.status(201).json(result.user);
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const token = await authService.login(req.body);
        res.status(token?.statusCode || RESPONSE_STATUS_CODE.OK).json(token?.user || token);
    } catch (err) {
        next(err);
    }
};

export const exitUser = async (req, res, next) => {
    try {
        await authService.logout(req.body);
        res.status(RESPONSE_STATUS_CODE.NO_CONTENT);
    } catch (err) {
        next(err);
    }
};

export const checkFields = async (req, res, next) => {
    const { email, } = req.query;
    try {
        const result = await authService.checkFieldInDB(email);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const verifyUser = async (req, res, next) => {
    try {
        const { verifyToken, } = req.body;
        const userAddress = await tokenService.verifyEmailToken(verifyToken);
        if ('statusCode' in userAddress) {
            res.status(userAddress?.statusCode).json(userAddress?.user);
            return;
        }

        const userAddressValue = 'address' in userAddress && userAddress.address;
        const verifyState = await authService.verifyTokenFormUser(userAddressValue);

        await tokenService.changeEmailTokenStatus(verifyToken);

        res.status(verifyState?.statusCode).json(verifyState?.user);
    } catch (err) {
        next(err);
    }
};