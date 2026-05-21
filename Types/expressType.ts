import { NextFunction, Request as EXReq, Response, } from 'express';

interface IUser {
    email: string;
    _id: string;
    isVerify?: boolean;
    role?: string;
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