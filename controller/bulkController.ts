import { MESSAGES, RESPONSE_STATUS_CODE } from '../constants';
import { getAuthContext } from '../Helpers';
import * as bulkService from '../services/bulkService';
import { updateMessage } from '../util';

export const createBulk = async (req, res, next) => {
    try {
        const auth = getAuthContext(req);
        if (!auth?.isVerify) {
            res.status(RESPONSE_STATUS_CODE.FORBIDDEN).json(updateMessage(MESSAGES.ACCOUNT_IS_NOT_VERIFY).user);
            return;
        }
        // TODO: Extract the "role" property into an enumeration for better type safety and maintainability
        if (auth.role !== 'admin') {
            res.status(RESPONSE_STATUS_CODE.FORBIDDEN).json(updateMessage(MESSAGES.PERMISSION).user);
            return;
        }

        const resultIds = [];
        const { body } = req;
        if (body?.products?.length >= 1) {
            const result = await bulkService.createBulkProducts(req.body);
            resultIds.push(...result);
        }

        res.status(200).json(resultIds);
    } catch (err) {
        next(err);
    }
};
