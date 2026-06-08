import { RESPONSE_STATUS_CODE } from '../constants';
import * as configService from '../services/configService';

export const getGoalStatusIds = (_req, res, next) => {
    try {
        const statusIds = configService.getGoalStatusIds();
        res.status(RESPONSE_STATUS_CODE.OK).json({ statusIds });
    } catch (err) {
        next(err);
    }
};
