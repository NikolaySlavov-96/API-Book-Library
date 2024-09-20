import { getBookByEmail, } from '../services/searchService';

import { queryParser, } from '../Helpers';

export const viewUserBooksFromEmail = async (req, res, next) => {
    try {
        const { limit, offset, email, } = queryParser(req?.query);

        const result = await getBookByEmail({ email, offset, limit, });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};