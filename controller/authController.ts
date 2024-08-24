import {
    register,
    login, logout, checkFieldInDB,
    verifyTokenFormUser,
} from '../services/authService';
import { jwtVerify, } from '../util';
import verifyAccount from '../services/mailService';

import { EMAIL, MESSAGES, } from '../constants';


export const createUser = async (req, res, next) => {
    try {
        const body = req.body;

        const result = await register(body);

        if (result.statusCode) {
            return res.status(result.statusCode).json(result.user);
        }

        const emailData = [{ type: EMAIL.REGISTER_CONFIRM, }];
        verifyAccount({ email: req.body.email, }, emailData);

        res.status(201).json(result);
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const token = await login(req.body);
        res.status(token?.statusCode || 200).json(token?.user || token);
    } catch (err) {
        next(err);
    }
};

export const exitUset = async (req, res, next) => {
    const token = req.token;
    try {
        await logout(token);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
};

export const checkFields = async (req, res, next) => {
    const { email, } = req.query;
    try {
        const result = await checkFieldInDB(email);
        res.json(result);
    } catch (err) {
        next(err);
    }
};

export const verifyUser = async (req, res, next) => {
    try {
        const { verifyToken, } = req.body;
        const isVerify = await jwtVerify(verifyToken);
        const verifyState = await verifyTokenFormUser(isVerify);

        res.status(verifyState?.statusCode).json(verifyState?.user || MESSAGES.SUCCESSFULLY_VERIFY_ACCOUNT);
    } catch (err) {
        next(err);
    }
};