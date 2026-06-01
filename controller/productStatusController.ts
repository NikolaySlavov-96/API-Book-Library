import { cacheKeys, MESSAGES, queryOperators, RESPONSE_STATUS_CODE } from '../constants';
import { buildCacheKey, getAuthContext, getUserId, pageParser, searchParser } from '../Helpers';
import { cacheDataWithExpiration, deleteCacheEntry, deleteKeysWithPrefix } from '../services/cacheService';
import * as productStatusService from '../services/productStatusService';
import { updateMessage } from '../util';

export const getAllStatus = async (req, res, next) => {
    try {
        const result = await productStatusService.getAllStates();
        res.status(200).json(result);
    } catch (err) {
        next(err);
    }
};

export const getStatusCounts = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const result = await productStatusService.getStatusCounts(userId);
        res.status(RESPONSE_STATUS_CODE.OK).json(result);
    } catch (err) {
        next(err);
    }
};

export const getAllProductsByStatus = async (req, res, next) => {
    const { limit, offset } = pageParser(req?.query);
    const { searchContent } = searchParser(req?.query);

    const filterOperator = queryOperators.ILIKE;

    const userId = getUserId(req);
    const { statusId } = req.params;

    try {
        const result = await productStatusService.getAllDate({
            statusId,
            userId,
            offset,
            limit,
            searchContent,
            filterOperator,
        });

        res.status(RESPONSE_STATUS_CODE.OK).json(result);
    } catch (err) {
        next(err);
    }
};

export const getProductStatusById = async (req, res, next) => {
    try {
        const productId = parseInt(req.params.id);
        const userId = getUserId(req);

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
        const auth = getAuthContext(req);
        if (!auth?.isVerify) {
            res.status(RESPONSE_STATUS_CODE.FORBIDDEN).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
            return;
        }

        const status = await productStatusService.getStateById(req.body.statusId);
        if (!status) {
            res.status(RESPONSE_STATUS_CODE.BAD_REQUEST).json(updateMessage(MESSAGES.STATUS_DOES_NOT_EXIST).user);
            return;
        }

        await productStatusService.addingNewProductStatus(auth.id, req.body);

        const key = buildCacheKey(cacheKeys.PRODUCT_STATUS_ID, req);
        await deleteCacheEntry(key);
        // The catalog now embeds the user's current status per product, so a status change
        // invalidates those cached pages.
        await deleteKeysWithPrefix(cacheKeys.ALL_PRODUCTS);

        res.status(RESPONSE_STATUS_CODE.CREATED).json(
            updateMessage(MESSAGES.SUCCESSFULLY_ADDED_PRODUCT_IN_COLLECTION).user,
        );
    } catch (err) {
        next(err);
    }
};

export const deleteProductStatus = async (req, res, next) => {
    try {
        const auth = getAuthContext(req);
        if (!auth?.isVerify) {
            res.status(RESPONSE_STATUS_CODE.FORBIDDEN).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
            return;
        }

        const productId = parseInt(req.params.productId);
        const removed = await productStatusService.removeProductStatus(auth.id, productId);

        if (!removed) {
            res.status(RESPONSE_STATUS_CODE.BAD_REQUEST).json(updateMessage(MESSAGES.PRODUCT_NOT_IN_COLLECTION).user);
            return;
        }

        const key = buildCacheKey(cacheKeys.PRODUCT_STATUS_ID, req);
        await deleteCacheEntry(key);
        // Removing a shelf status changes what the catalog shows for this user.
        await deleteKeysWithPrefix(cacheKeys.ALL_PRODUCTS);

        res.status(RESPONSE_STATUS_CODE.OK).json(
            updateMessage(MESSAGES.SUCCESSFULLY_REMOVED_PRODUCT_FROM_COLLECTION).user,
        );
    } catch (err) {
        next(err);
    }
};
