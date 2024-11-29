import { getProductsByEmail, } from '../services/searchService';

import { emailParser, pageParser, } from '../Helpers';

export const viewUserProductsFromEmail = async (req, res, next) => {
    try {
        const { limit, offset, } = pageParser(req?.query);
        const { email, } = emailParser(req?.query);

        const result = await getProductsByEmail({ email, offset, limit, });
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};