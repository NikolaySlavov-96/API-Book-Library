import { MESSAGES, } from '../constants';

import * as bookStateService from '../services/bookStateService';

import { verify, } from '../services/verifyDataService';
import { updateMessage, } from '../util';


export const getAllBooksByState = async (req, res, next) => {
    const state = req.params.state;
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const skipSource = (page - 1) * limit;
    const user_id = req?.user?.id;

    try {
        const result = await bookStateService.getAllDate({ state, user_id, offset: skipSource, limit, });
        result.rows.map((e) => {
            e.dataValues.id = e.book.id;
            e.dataValues.author = e.book.author;
            e.dataValues.booktitle = e.book.booktitle;
            e.dataValues.genre = e.book.genre;
        });

        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getBooksById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const user_id = req?.user?.id;
        const result = await bookStateService.getDateById(id);
        if (user_id) {
            const resFromBookState = await bookStateService.getInfoFromBookState(id, user_id);
            result.dataValues.bookState = resFromBookState ? resFromBookState.book_state : false;
        }
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const createBookState = async (req, res, next) => {
    try {
        const state = req.params.state;
        const user_id = req.user.id;

        // Mode in middleware
        const checkAccount = await verify({ id: user_id, isVerify: true, });
        if (checkAccount === null) {
            res.status(401).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
        }

        const { bookId, } = req.body;

        const result = await bookStateService.addingNewBookState({ user_id, book_id: bookId, state, });
        res.status(201).json(JSON.stringify(result, null, 4));
    } catch (err) {
        next(err);
    }
};