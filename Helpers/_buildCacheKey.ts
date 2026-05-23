import { type Request as expressRequest } from 'express';

import { cacheKeys } from '../constants';
import { type Request as customRequest } from '../Types/expressType';

import { pageParser, searchParser, statusParser } from '.';

type TRequest = expressRequest | customRequest;

// const _buildCacheKey = (key: keyof cacheKeys, req) => {
const _buildCacheKey = (key, req) => {
    let customKey = key;

    if (key === cacheKeys.PRODUCT_ID) {
        customKey += req.params.id;
    }
    if (key === cacheKeys.PRODUCT_STATUS_ID) {
        const productId = req.params.id || req.params.productId || req.body.productId;
        customKey += `${productId}-${req?.user?._id}`;
    }
    if (key === cacheKeys.ALL_PRODUCTS) {
        const { limit, offset } = pageParser(req?.query);
        const { searchContent } = searchParser(req?.query);
        const { statusId } = statusParser(req?.query);

        customKey += `${limit}-${offset}-${searchContent}-${statusId}-${req?.user?._id}`;
    }

    return customKey;
};

export default _buildCacheKey;
