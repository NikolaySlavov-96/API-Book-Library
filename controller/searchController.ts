import { getBookByEmail, } from '../services/searchService';

import { emailParser, pageParser, } from '../Helpers';

export const viewUserBooksFromEmail = async (req, res, next) => {
    try {
        const { limit, offset, } = pageParser(req?.query);
        const { email, } = emailParser(req?.query);

        const result = await getBookByEmail({ email, offset, limit, });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};