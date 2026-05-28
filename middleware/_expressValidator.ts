import { validationResult } from 'express-validator';

import { type NextFunction, type Request, type Response } from '../Types/expressType';

export default (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).json({ message: errorParser(errors) });
        return;
    }

    next();
};

// TODO(lint): type `error` using express-validator's `Result<ValidationError>` (no-explicit-any).
const errorParser = (error: any) => {
    let message;

    // Work with error form Express Validator
    if (Array.isArray(error.errors)) {
        message = error.errors.map((e) => e.msg).join('\n');
    }

    return message;
};
