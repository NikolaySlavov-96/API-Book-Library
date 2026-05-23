import { type NextFunction, type Request, type Response } from '../Types/expressType';
export default () => async (req: Request, res: Response, next: NextFunction) => {
    const ipFromNGINX = req.headers['x-forwarded-for'];
    const agentType = req.headers['user-agent'];
    console.log('🚀 ~ agentType:', agentType);
    console.log('🚀 ~ ipCheck:', ipFromNGINX);

    next();
};
