import { getBookByEmail, } from '../services/searchService';


export const viewUserBooksFromEmail = async (req, res, next) => {
    try {
        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || 10;
        const skipSource = (page - 1) * limit;

        const books = {} //await getBookByEmail();
        res.json(books);
    } catch (err) {
        next(err);
    }
};


export const getUser = async (req, res, next) => {
    try {
        const token = {} //await login(req.body);
        res.json(token);
    } catch (err) {
        next(err);
    }
};