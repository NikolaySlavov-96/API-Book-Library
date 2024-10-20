import { buildCacheKey, } from '../Helpers';
import { NextFunction, Request, Response, } from '../Types/expressType';

import { MESSAGES, RESPONSE_STATUS_CODE, } from '../constants';

import { fetchCacheData, } from '../services/cacheService';

import { updateMessage, } from '../util';

const _cacheMiddleware = (key: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const customKey = buildCacheKey(key, req);

            const data = await fetchCacheData(customKey);
            if (data !== null) {
                res.status(RESPONSE_STATUS_CODE.OK).json(JSON.parse(data));
                // res.status(200).json({ source: 'cache', data: JSON.parse(data), });
            } else {
                next();
            }
        } catch (err) {
            console.log('ERROR ~ cacheMiddleware: ', err);
            res.status(RESPONSE_STATUS_CODE.SERVER_ERROR).json(
                updateMessage(MESSAGES.MESSAGE_AT_ERROR_FROM_SERVER).user
            );
        }
    };
};

export default _cacheMiddleware;