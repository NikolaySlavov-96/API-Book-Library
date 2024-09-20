import { getBookByEmail, } from '../services/searchService';

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