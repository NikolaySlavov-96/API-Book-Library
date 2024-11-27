import { MESSAGES, ESendEvents, queryOperators, cacheKeys, RESPONSE_STATUS_CODE, } from '../constants';

import { emitToSocketEvent, } from '../Events';

import { buildCacheKey, pageParser, searchParser, } from '../Helpers';

import * as productService from '../services/productService';
import * as fileService from '../services/fileService';
import {
    cacheDataWithExpiration,
    deleteCacheEntry,
    deleteKeysWithPrefix,
} from '../services/cacheService';

import { updateMessage, } from '../util';
import {
    getUserVerificationStatus,
} from '../services/getUserVerificationStatus';

export const getAllProducts = async (req, res, next) => {
    const { limit, offset, } = pageParser(req?.query);
    const { searchContent, } = searchParser(req?.query);

    const filterOperator = queryOperators.LIKE;

    try {
        const result = await productService.getAllData({ offset, limit, filterOperator, searchContent, });

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
            res.status(RESPONSE_STATUS_CODE.NO_CONTENT);
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
        const userId = req.user._id;
        const checkAccount = await getUserVerificationStatus(userId);
        if (!checkAccount) {
            res.status(RESPONSE_STATUS_CODE.UNAUTHORIZED).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
            return;
        }

        const result = await productService.create(req.body);

        if (result.id) {
            emitToSocketEvent(ESendEvents.NEW_PRODUCT_ADDED, result);
        }

        const requestRespond = result?.user ? result?.user : { productId: result.id, };
        const statusCode = result?.statusCode ? result?.statusCode : RESPONSE_STATUS_CODE.CREATED;
        res.status(statusCode).json(requestRespond);

        await deleteKeysWithPrefix(cacheKeys.ALL_PRODUCTS);
    } catch (err) {
        next(err);
    }
};

export const addedImageOnProduct = async (req, res, next) => {
    try {
        if (!req.files) {
            res.status(RESPONSE_STATUS_CODE.BAD_REQUEST).json(updateMessage(MESSAGES.PLEASE_ADDED_FILE).user);
            return;
        }
        const { deliverFile, } = req.files;
        const fileData = await fileService.addingFile(deliverFile, req.body);

        res.status(RESPONSE_STATUS_CODE.OK).json(fileData);
    } catch (err) {
        next(err);
    }
};

export const removeImageOnProduct = async (req, res, next) => {
    try {
        const fileId = req.params.id;
        const resultFromUnlink = await fileService.removeFile(fileId);
        res.status(resultFromUnlink.statusCode).json(resultFromUnlink.user);
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
        next();
    }
};