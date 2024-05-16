import { NextFunction, Request, Response, } from '../../Types/expressType';

import { updateMessage, verifyToken, } from '../../util';

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
            return res.status(404).json(updateMessage({ message: 'Invalid', }).user);
            // return res.status(404).json(updateMessage(INVALID_AUTHORIZE_TOKEN).user);
        }
    }

    next();
};