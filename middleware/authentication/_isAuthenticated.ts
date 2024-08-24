import { NextFunction, Request, Response, } from '../../Types/expressType';

import { MESSAGES, } from '../../constants';

import { updateMessage, } from '../../util';

const _isAuthenticated = () => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req?.authenticated) {
            return res.status(400).json(updateMessage(MESSAGES.PLEASE_LOGIN).user);
        }
        next();
    };
};

export default _isAuthenticated;