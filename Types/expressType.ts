import { NextFunction, type Request as EXReq, Response } from 'express';

import { type EUserRole } from '../constants';

interface IUser {
    email: string;
    _id: string;
    isVerify?: boolean;
    role?: EUserRole;
    organisation?: string;
}

interface Request extends EXReq {
    user?: IUser;
    token?: string;
    authenticated?: boolean;
    bonus?: {
        prefId?: string;
        rolles?: string[];
    };
}

export { NextFunction, Request, Response };
