import { MESSAGES, } from '../constants';

import * as bookService from '../services/bookService';
import { verify, } from '../services/verifyDataService';

import { updateMessage, } from '../util';


export const getAllBooks = async (req, res, next) => {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const skipSource = (page - 1) * limit;

    try {
        const result = await bookService.getAllData({ offset: skipSource, limit, });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getBookById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const result = await bookService.getDataById(id);
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const createBook = async (req, res, next) => {
    try {
        const user_id = req.user.id;

        // Move in middleware
        const checkAccount = await verify('user', { id: user_id, isVerify: true, });
        if (checkAccount === null) {
            res.status(401).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
        }

        const { author, booktitle, } = req.body;

        const result = await bookService.create({ author, booktitle, });

        const requestRespond = result.message ? result.message : JSON.stringify(result, null, 4);
        res.status(result.statusCode ? result.statusCode : 201).json(requestRespond);
    } catch (err) {
        next(err);
    }
};

export const updateBook = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { author, booktitle, } = req.body;

    try {
        const result = await bookService.update({ author, booktitle, id, });
        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
};

export const deleteBook = async (req, res, next) => {
    const id = parseInt(req.params.id);

    try {
        await bookService.remove(id);
        res.status(204).end();
    } catch (err) {
        next();
    }
};