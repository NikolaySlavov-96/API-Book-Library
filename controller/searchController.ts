import { getBookByEmail, searchBook, } from '../services/searchService';


export const viewUserBooksFromEmail = async (req, res, next) => {
    try {
        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || 10;
        const skipSource = (page - 1) * limit;

        const books = {}; //await getBookByEmail();
        res.json(books);
    } catch (err) {
        next(err);
    }
};

export const searchBooksByParams = async (req, res, next) => {
    try {
        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || 10;
        const skipSource = (page - 1) * limit;
        const searchContent = req.query.search && `%${req?.query?.search}%`;

        const result = await searchBook({ offset: skipSource, limit, typeSearch: 'Op.like', searchContent, });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};