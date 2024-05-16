import { NextFunction, Request, Response, } from '../../Types/expressType';

import { updateMessage, } from '../../util';

export default (req: Request, res: Response, next: NextFunction) => {
    if (!req?.authenticated) {
        return res.status(400).json(updateMessage({ message: 'tes', messageCode: 'user22', }).user);
    }
    next();
};