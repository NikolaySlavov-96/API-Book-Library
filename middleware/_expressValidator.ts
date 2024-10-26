import { validationResult, } from 'express-validator';

import { NextFunction, Request, Response, } from '../Types/expressType';

export default (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ message: errorParser(errors), });
        return;
    }

    next();
};

const errorParser = (error: any) => {
    let message;

    // Work with error form Express Validator
    if (Array.isArray(error.errors)) {
        message = error.errors.map((e) => e.msg).join('\n');
    }

    return message;
};