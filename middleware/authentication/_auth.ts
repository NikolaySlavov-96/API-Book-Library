import 'dotenv/config';

import { MESSAGES, RESPONSE_STATUS_CODE } from '../../constants';
import { authProvider } from '../../services/auth';
import { type NextFunction, type Request, type Response } from '../../Types/expressType';
import { updateMessage } from '../../util';

export default () => async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = Array.isArray(header) ? header[0] : header;

    if (token) {
        try {
            const payload = await authProvider.verifyAccessToken(token);
            if ('error' in payload) {
                res.status(RESPONSE_STATUS_CODE.UNAUTHORIZED).json(
                    updateMessage(MESSAGES.INVALID_AUTHORIZE_TOKEN).user,
                );
                return;
            }
            req.user = payload;
            req.token = token;
            req.authenticated = true;
        } catch (err) {
            res.status(RESPONSE_STATUS_CODE.SERVER_ERROR).json(
                updateMessage(MESSAGES.MESSAGE_AT_ERROR_FROM_SERVER).user,
            );
            return;
        }
    }

    next();
};
