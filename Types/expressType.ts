import { NextFunction, Request as EXReq, Response, } from 'express';
import { Socket, } from 'socket.io';

declare global {
    namespace Express {
        interface Response {
            SocketIo: Socket
        }
    }
}

interface IUser {
    email: string;
    _id: string;
    organisation?: string;
}

interface Request extends EXReq {
    user?: IUser;
    token?: string;
    authenticated?: boolean;
    bonus?: {
        prefId?: string,
        rolles?: string[],
    };
}


export {
    NextFunction,
    Request,
    Response,
};