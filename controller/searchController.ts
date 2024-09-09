import { getBookByEmail, searchBook, } from '../services/searchService';

import { paginationParser, } from '../Helpers';

export const viewUserBooksFromEmail = async (req, res, next) => {
    try {
        const { limit, offset, } = paginationParser(req?.query);

        const email = req?.query?.email;

        const result = await getBookByEmail({ email, offset, limit, });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const searchBooksByParams = async (req, res, next) => {
    try {
        const { limit, offset, } = paginationParser(req?.query);

        const searchContent = req.query.search && `%${req?.query?.search}%`;

        const result = await searchBook({ offset, limit, typeSearch: 'Op.like', searchContent, });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};