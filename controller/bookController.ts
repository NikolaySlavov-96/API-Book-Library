import { MESSAGES, ESendEvents, queryOperators, } from '../constants';

import { checkUserProfileVerification, queryParser, } from '../Helpers';

import * as bookService from '../services/bookService';
import * as fileService from '../services/fileService';

import { updateMessage, } from '../util';

export const getAllBooks = async (req, res, next) => {
    const { limit, offset, searchContent, } = queryParser(req?.query);

    const filterOperator = queryOperators.LIKE;

    try {
        const result = await bookService.getAllData({ offset, limit, filterOperator, searchContent, });
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
        const userId = req.user._id;
        const checkAccount = await checkUserProfileVerification(userId);
        if (!checkAccount) {
            return res.status(401).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
        }

        const result = await bookService.create(req.body);

        if (result.id) {
            res.SocketIo.emit(ESendEvents.NEW_BOOK_ADDED, result);
        }

        const requestRespond = result?.user ? result?.user : { bookId: result.id, };
        res.status(result?.statusCode ? result?.statusCode : 201).json(requestRespond);
    } catch (err) {
        next(err);
    }
};

export const addedImageOnBook = async (req, res, next) => {
    try {
        if (!req.files) {
            return res.status(400).json(updateMessage(MESSAGES.PLEASE_ADDED_FILE).user);
        }
        const { deliverFile, } = req.files;
        const fileData = await fileService.addingFile(deliverFile, req.body);

        res.status(200).json(fileData);
    } catch (err) {
        next(err);
    }
};

export const removeImageOnBook = async (req, res, next) => {
    try {
        const fileId = req.params.id;
        const resultFromUnlink = await fileService.removeFile(fileId);
        res.status(resultFromUnlink.statusCode).json(resultFromUnlink.user);
    } catch (err) {
        next(err);
    }
};


// TODO For Future
export const updateBook = async (req, res, next) => {
    const id = parseInt(req.params.id);
    const { author, booktitle, } = req.body;

    try {
        const result = await bookService.update({ author, booktitle, id, });
        res.status(200).send(result); // TODO Check if it should be "send" or "json"
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