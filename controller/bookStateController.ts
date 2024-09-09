import { MESSAGES, } from '../constants';

import { checkUserProfileVerification, paginationParser, } from '../Helpers';

import * as bookStateService from '../services/bookStateService';

import { updateMessage, } from '../util';


export const getAllBooksByState = async (req, res, next) => {
    const { limit, offset, } = paginationParser(req?.query);

    const userId = req?.user?._id;
    const state = req.params.state;

    try {
        const result = await bookStateService.getAllDate({ state, userId, offset, limit, });

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getBookStateById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const userId = req?.user?._id;

        const data = await bookStateService.getInfoFromBookState(id, userId);
        res.status(200).json(data);
    } catch (err) {
        next(err);
    }
};

export const createBookState = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const checkAccount = await checkUserProfileVerification(userId);
        if (!checkAccount) {
            res.status(401).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
        }

        const { bookId, state, } = req.body;

        await bookStateService.addingNewBookState({ userId, bookId, state, });
        res.status(201).json(updateMessage(MESSAGES.SUCCESSFULLY_ADDED_BOOK_IN_COLLECTION).user);
    } catch (err) {
        next(err);
    }
};