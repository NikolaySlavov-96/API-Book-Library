import { cacheKeys, ESendEvents, EUserRole, MESSAGES, queryOperators, RESPONSE_STATUS_CODE } from '../constants';
import { emitToSocketEvent } from '../Events';
import { buildCacheKey, getAuthContext, pageParser, searchParser, statusParser } from '../Helpers';
import { cacheDataWithExpiration, deleteCacheEntry, deleteKeysWithPrefix } from '../services/cacheService';
import * as productService from '../services/productService';
import { updateMessage } from '../util';

export const getAllProducts = async (req, res, next) => {
    const { limit, offset } = pageParser(req?.query);
    const { searchContent } = searchParser(req?.query);
    const { statusId } = statusParser(req?.query);

    const filterOperator = queryOperators.LIKE;

    // Status filtering only makes sense for a logged-in user (reads token if present)
    const userId = req?.user?._id;

    try {
        const result = await productService.getAllData({
            offset,
            limit,
            filterOperator,
            searchContent,
            statusId,
            userId,
        });

        const key = buildCacheKey(cacheKeys.ALL_PRODUCTS, req);
        await cacheDataWithExpiration(key, result);

        res.status(RESPONSE_STATUS_CODE.OK).json(result);
    } catch (err) {
        next(err);
    }
};

export const getProductById = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const result = await productService.getDataById(id);

        if (!result) {
            res.status(RESPONSE_STATUS_CODE.NO_CONTENT).end();
            return;
        }

        const key = buildCacheKey(cacheKeys.PRODUCT_ID, req);
        await cacheDataWithExpiration(key, result);

        res.status(RESPONSE_STATUS_CODE.OK).json(result);
    } catch (err) {
        next(err);
    }
};

export const createProduct = async (req, res, next) => {
    try {
        const auth = getAuthContext(req);
        if (!auth?.isVerify) {
            res.status(RESPONSE_STATUS_CODE.FORBIDDEN).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
            return;
        }
        if (auth.role !== EUserRole.SUPPORT) {
            res.status(RESPONSE_STATUS_CODE.FORBIDDEN).json(updateMessage(MESSAGES.PERMISSION).user);
            return;
        }

        const result = await productService.create(req.body);

        if (result.id) {
            emitToSocketEvent(ESendEvents.NEW_PRODUCT_ADDED, result);
        }

        const requestRespond = result?.user ? result?.user : { productId: result.id };
        const statusCode = result?.statusCode ? result?.statusCode : RESPONSE_STATUS_CODE.CREATED;
        res.status(statusCode).json(requestRespond);

        await deleteKeysWithPrefix(cacheKeys.ALL_PRODUCTS);
    } catch (err) {
        next(err);
    }
};

// TODO For Future
export const updateProduct = async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);
        const result = await productService.update(id, req.body);

        const key = buildCacheKey(cacheKeys.PRODUCT_ID, req);
        await deleteCacheEntry(key);

        res.status(RESPONSE_STATUS_CODE.OK).json(result);
    } catch (err) {
        next(err);
    }
};

export const deleteProduct = async (req, res, next) => {
    const id = parseInt(req.params.id);

    try {
        await productService.remove(id);
        res.status(RESPONSE_STATUS_CODE.NO_CONTENT).end();
    } catch (err) {
        next(err);
    }
};
