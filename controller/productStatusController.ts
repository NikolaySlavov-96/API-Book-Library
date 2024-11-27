import { MESSAGES, queryOperators, cacheKeys, RESPONSE_STATUS_CODE, } from '../constants';

import { buildCacheKey, pageParser, searchParser, } from '../Helpers';

import * as productStatusService from '../services/productStatusService';
import {
    getUserVerificationStatus,
} from '../services/getUserVerificationStatus';
import { cacheDataWithExpiration, deleteCacheEntry, } from '../services/cacheService';
import { getAllStates, } from '../services/stateService';

import { updateMessage, } from '../util';


export const getAllStatus = async (req, res, next) => {
    try {
        const result = await getAllStates();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getAllProductsByStatus = async (req, res, next) => {
    const { limit, offset, } = pageParser(req?.query);
    const { searchContent, } = searchParser(req?.query);

    const filterOperator = queryOperators.LIKE;

    const userId = req?.user?._id;
    const statusId = req.params.statusId;

    try {
        const result = await productStatusService.getAllDate({
            statusId, userId, offset, limit, searchContent, filterOperator,
        });

        res.status(RESPONSE_STATUS_CODE.OK).json(result);
    } catch (err) {
        next(err);
    }
};

export const getProductStatusById = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.id);
        const userId = req?.user?._id;

        const data = await productStatusService.getInfoFromProductStatus(productId, userId);

        const key = buildCacheKey(cacheKeys.PRODUCT_STATUS_ID, req);
        await cacheDataWithExpiration(key, data);

        res.status(RESPONSE_STATUS_CODE.OK).json(data);
    } catch (err) {
        next(err);
    }
};

export const createProductStatus = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const checkAccount = await getUserVerificationStatus(userId);
        if (!checkAccount) {
            res.status(RESPONSE_STATUS_CODE.UNAUTHORIZED).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
        }

        await productStatusService.addingNewProductStatus(userId, req.body);

        const key = buildCacheKey(cacheKeys.PRODUCT_STATUS_ID, req);
        await deleteCacheEntry(key);

        res.status(RESPONSE_STATUS_CODE.CREATED).json(
            updateMessage(MESSAGES.SUCCESSFULLY_ADDED_BOOK_IN_COLLECTION).user
        );
    } catch (err) {
        next(err);
    }
};