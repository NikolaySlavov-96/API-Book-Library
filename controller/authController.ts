import {
    register,
    login, logout, checkFieldInDB,
    verifyTokenFormUser,
} from '../services/authService';
import { jwtVerify, } from '../util';
import verifyAccount from '../services/mailService';

import { EMAIL, } from '../constants';


export const createUser = async (req, res, next) => {
    try {
        const body = req.body;
        if (body.password !== body.rePassword) {
            throw new Error('Password not\t match');
        }
        const msg = await register(body);

        const emailData = [{ type: EMAIL.REGISTER_CONFIRM, }];
        verifyAccount({ email: req.body.email, }, emailData);
        res.status(201).json(msg);
    } catch (err) {
        next(err);
    }
};

export const getUser = async (req, res, next) => {
    try {
        const token = await login(req.body);
        res.json(token);
    } catch (err) {
        next(err);
    }
};

export const exitUset = async (req, res, next) => {
    const token = req.token;
    try {
        const data = await logout(token);
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

        if (verifyState.message) {
            return res.status(402).json({ message: verifyState.message, });
        }

        res.status(200).json({ message: 'Successfull Verify', isVerify: verifyState, });
    } catch (err) {
        next(err);
    }
};