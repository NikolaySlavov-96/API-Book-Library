import { createLogger } from '../Helpers';
import { type NextFunction, type Request, type Response } from '../Types/expressType';

const log = createLogger('checkClientIP');

// TODO(lint): drop `async` — the function body has no `await` (require-await).
export default () => async (req: Request, res: Response, next: NextFunction) => {
    const ipFromNGINX = req.headers['x-forwarded-for'];
    const agentType = req.headers['user-agent'];
    log.debug('🚀 ~ agentType:', agentType);
    log.debug('🚀 ~ ipCheck:', ipFromNGINX);

    next();
};
