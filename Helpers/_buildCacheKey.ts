import { redisCacheKeys, } from '../constants';

const _buildCacheKey = (key, req) => {
    let customKey = key;

    if (key === redisCacheKeys.BOOK_ID) {
        customKey += req.params.id;
    }
    if (key === redisCacheKeys.BOOK_STATE_ID) {
        const bookId = req.params.id || req.body.bookId;
        customKey += `${bookId}-${req?.user?._id}`;
    }

    return customKey;
};

export default _buildCacheKey;