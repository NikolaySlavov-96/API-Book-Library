import { NextFunction, Request, Response, } from '../../Types/expressType';

import { updateMessage, verifyToken, } from '../../util';

import { MESSAGES, RESPONSE_STATUS_CODE, } from '../../constants';

export default () => async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers['book-id'];
    const token = Array.isArray(header) ? header[0] : header;

    if (token) {
        try {
            const payload = await verifyToken(token);
            req.user = payload;
            req.token = token;
            req.authenticated = true;
        } catch (err) {
            const errorMessage = err?.message;
            if (errorMessage?.includes('xpired') || errorMessage?.includes('nvalid')) {
                res.status(RESPONSE_STATUS_CODE.UNAUTHORIZED).json(
                    updateMessage(MESSAGES.INVALID_AUTHORIZE_TOKEN).user
                );
                return;
            }
            res.status(RESPONSE_STATUS_CODE.SERVER_ERROR).json(
                updateMessage(MESSAGES.MESSAGE_AT_ERROR_FROM_SERVER).user
            );
            return;
        }
    }

    next();
};