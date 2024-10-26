import { EMAIL, } from '../constants';

import * as authService from '../services/authService';
import verifyAccount from '../services/mailService';

import { jwtVerify, } from '../util';

export const createUser = async (req, res, next) => {
    try {
        const body = req.body;

        const result = await authService.register(body);

        if (result.statusCode) {
            res.status(result.statusCode).json(result.user);
            return;
        }

        const emailData = [{ type: EMAIL.REGISTER_CONFIRM, }];
        verifyAccount({ email: req.body.email, }, emailData);

        res.status(201).json(result.user);
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const token = await authService.login(req.body);
        res.status(token?.statusCode || 200).json(token?.user || token);
    } catch (err) {
        next(err);
    }
};

export const exitUser = async (req, res, next) => {
    const token = req.token;
    try {
        await authService.logout(token);
        res.status(204).end();
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
        const isVerify = await jwtVerify(verifyToken);
        const verifyState = await authService.verifyTokenFormUser(isVerify);

        res.status(verifyState?.statusCode).json(verifyState?.user);
    } catch (err) {
        next(err);
    }
};