import { MESSAGES, RESPONSE_STATUS_CODE } from '../constants';
import { type NextFunction, type Request, type Response } from '../Types/expressType';
import { updateMessage } from '../util';

import { createLogger } from './_logger';

const log = createLogger('globalErrorHandling');

export const _globalErrorHandling = () => {
    return (err: Error, req: Request, res: Response, next: NextFunction) => {
        log.error(`≈ nnsn ~ _globalErrorHandling ~ err~`, err);
        res.status(RESPONSE_STATUS_CODE.SERVER_ERROR).json(updateMessage(MESSAGES.MESSAGE_AT_ERROR_FROM_SERVER).user);
    };
};
