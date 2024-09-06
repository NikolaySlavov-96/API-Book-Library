import { NextFunction, Request, Response, } from '../../Types/expressType';

import { updateMessage, } from '../../util';

const _hasPermission = () => {
    return (role: string) => {
        return (req: Request, res: Response, next: NextFunction) => {
            try {
                const userRoles = req.bonus?.rolles;
                if (!userRoles.includes(role)) {
                    return res.status(400).json(updateMessage({ message: 'unaut', messageCode: '2442', }).user);
                }
            } catch (error) {
                // To Do verify or adding Sentry
                return res.status(405).json(updateMessage({ message: 'unaut', messageCode: '2442', }).user);
            }
            next();
        };
    };
};

export default _hasPermission;