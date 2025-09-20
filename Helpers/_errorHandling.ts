import { NextFunction, Request, Response, } from '../Types/expressType';

import { updateMessage, } from '../util';

import { MESSAGES, RESPONSE_STATUS_CODE, } from '../constants';

export const _globalErrorHandling = () => {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
        console.log(`≈ nnsn ~ _globalErrorHandling ~ err~`, err)
        res.status(RESPONSE_STATUS_CODE.SERVER_ERROR).json(
            updateMessage(MESSAGES.MESSAGE_AT_ERROR_FROM_SERVER).user
        );
    };
};