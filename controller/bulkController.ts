import { MESSAGES, RESPONSE_STATUS_CODE, } from '../constants';

import * as bulkService from '../services/bulkService';

import { updateMessage, } from '../util';
import {
    getUserVerificationStatus,
} from '../services/getUserVerificationStatus';

export const createBulk = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const checkAccount = await getUserVerificationStatus(userId);
        if (!checkAccount) {
            res.status(RESPONSE_STATUS_CODE.UNAUTHORIZED).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
            return;
        }
        // TODO: Extract the "role" property into an enumeration for better type safety and maintainability
        if (checkAccount?.role !== 'admin') {
            res.status(RESPONSE_STATUS_CODE.UNAUTHORIZED).json(updateMessage(MESSAGES.PERMISSION).user);
            return;
        }

        const resultIds = [];
        const body = req.body;
        if (body?.products?.length >= 1) {
            const result = await bulkService.createBulkProducts(req.body);
            resultIds.push(...result);
        }

        res.status(200).json(resultIds);
    } catch (err) {
        next(err);
    }
};