import { NextFunction, Request, Response, } from '../Types/expressType';

import { updateMessage, } from '../util';

import { MESSAGES, } from '../constants';

export const _globalErrorHandling = () => {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(500).json(updateMessage(MESSAGES.MESSAGE_AT_ERROR_FROM_SERVER).user);
    };
};