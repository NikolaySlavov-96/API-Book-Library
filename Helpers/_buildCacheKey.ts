import { pageParser, searchParser, } from '.';

import { cacheKeys, } from '../constants';

const _buildCacheKey = (key, req) => {
    let customKey = key;

    if (key === cacheKeys.PRODUCT_ID) {
        customKey += req.params.id;
    }
    if (key === cacheKeys.PRODUCT_STATUS_ID) {
        const bookId = req.params.id || req.body.bookId;
        customKey += `${bookId}-${req?.user?._id}`;
    }
    if (key === cacheKeys.ALL_PRODUCTS) {
        const { limit, offset, } = pageParser(req?.query);
        const { searchContent, } = searchParser(req?.query);

        customKey += `${limit}-${offset}-${searchContent}`;
    }

    return customKey;
};

export default _buildCacheKey;