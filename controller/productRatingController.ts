import { MESSAGES, cacheKeys, RESPONSE_STATUS_CODE, } from '../constants';

import { buildCacheKey, } from '../Helpers';

import * as productRatingService from '../services/productRatingService';
import { getUserVerificationStatus, } from '../services/getUserVerificationStatus';
import { deleteCacheEntry, } from '../services/cacheService';

import { updateMessage, } from '../util';

export const getProductRating = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.id);
        const userId = req?.user?._id;

        const aggregate = await productRatingService.getRatingAggregate(productId);
        const userRating = userId ? await productRatingService.getUserRating(userId, productId) : 0;

        res.status(RESPONSE_STATUS_CODE.OK).json({ ...aggregate, userRating, });
    } catch (err) {
        next(err);
    }
};

export const rateProduct = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const checkAccount = await getUserVerificationStatus(userId);
        if (!checkAccount) {
            res.status(RESPONSE_STATUS_CODE.UNAUTHORIZED).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
            return;
        }

        const productId = parseInt(req.params.id);
        const { rating, } = req.body;

        await productRatingService.upsertRating(userId, { productId, rating, });

        const key = buildCacheKey(cacheKeys.PRODUCT_ID, req);
        await deleteCacheEntry(key);

        const aggregate = await productRatingService.getRatingAggregate(productId);
        res.status(RESPONSE_STATUS_CODE.OK).json({ ...aggregate, userRating: rating, });
    } catch (err) {
        next(err);
    }
};
