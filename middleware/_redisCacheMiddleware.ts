import { NextFunction, Request, Response, } from '../Types/expressType';

import { MESSAGES, redisCacheKeys, RESPONSE_STATUS_CODE, } from '../constants';

import { fetchCacheData, } from '../services/redisService';

import { updateMessage, } from '../util';

const _redisCacheMiddleware = (key: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            let customKey = key;
            if (key === redisCacheKeys.BOOK_ID || key === redisCacheKeys.BOOK_STATE_ID) {
                customKey += req.params.id;
            }

            const data = await fetchCacheData(customKey);
            if (data !== null) {
                res.status(200).json({ source: 'cache', data: JSON.parse(data), });
            } else {
                next();
            }
        } catch (err) {
            console.log('ERROR ~ redisCacheMiddleware: ', err);
            res.status(RESPONSE_STATUS_CODE.SERVER_ERROR).json(
                updateMessage(MESSAGES.MESSAGE_AT_ERROR_FROM_SERVER).user
            );
        }
    };
};

export default _redisCacheMiddleware;