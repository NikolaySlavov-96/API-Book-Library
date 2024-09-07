import { MESSAGES, } from '../constants';
import messages from '../constants/_messages';

import * as bookStateService from '../services/bookStateService';

import { verify, } from '../services/verifyDataService';
import { updateMessage, } from '../util';


export const getAllBooksByState = async (req, res, next) => {
    const state = req.params.state;
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const skipSource = (page - 1) * limit;
    const userId = req?.user?._id;

    try {
        const result = await bookStateService.getAllDate({ state, userId, offset: skipSource, limit, });

        result.rows.map((e) => {
            const bookDate = e.Book;
            e.bookId = bookDate.id;
            e.bookTitle = bookDate.bookTitle;
            e.genre = bookDate.genre;

            const authorDate = e.Book.Author;
            e.authorId = authorDate.id;
            e.authorName = authorDate.name;

            const userDate = e.User;
            e.email = userDate.email;
            e.userId = userDate.id;

            delete e.Book;
            delete e.User;
        });

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
        // Mode in middleware
        const checkAccount = await verify({ id: userId, isVerify: true, });
        if (!checkAccount) {
            res.status(401).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
        }

        const { bookId, state } = req.body;

        await bookStateService.addingNewBookState({ userId, bookId, state, });
        res.status(201).json(updateMessage(messages.SUCCESSFULLY_ADDED_BOOK_IN_COLLECTION).user);
    } catch (err) {
        next(err);
    }
};