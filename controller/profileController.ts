import { RESPONSE_STATUS_CODE } from '../constants';
import { getUserId } from '../Helpers';
import * as profileService from '../services/profileService';

export const getProfile = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const result: any = await profileService.getProfile(userId);

        if (result?.statusCode) {
            res.status(result.statusCode).json(result.user);
            return;
        }

        res.status(RESPONSE_STATUS_CODE.OK).json(result);
    } catch (err) {
        next(err);
    }
};

export const updateProfile = async (req, res, next) => {
    try {
        const userId = getUserId(req);
        const result: any = await profileService.updateProfile(userId, req.body);

        if (result?.statusCode) {
            res.status(result.statusCode).json(result.user);
            return;
        }

        res.status(RESPONSE_STATUS_CODE.OK).json(result);
    } catch (err) {
        next(err);
    }
};
