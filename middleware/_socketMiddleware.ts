import { NextFunction, Request, Response, } from '../Types/expressType';

const _socketMiddleware = (io) => {
    return (req: Request, res: Response, next: NextFunction) => {
        res.SocketIo = io;
        next();
    };
};

export default _socketMiddleware;