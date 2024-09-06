import { NextFunction, Request, Response, } from '../../Types/expressType';

import { updateMessage, } from '../../util';

export default (conditions?, secondConditin?) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        req.bonus = {};
        try {
            // const currentUser = await dbGlobalUtil(USER).findById(req.user._id);

            // if (!currentUser) {
            //     return res.status(GLOBAL_ERROR_CODE).json(updateMessage(IF_EXISTS_USER_SEND_EMAIL).user);
            // }

            // const checksForOrganisation = currentUser?.organisation && currentUser?.organisation === undefined;
            // if (conditions !== WITHOUT_ORG && checksForOrganisation) {
            // return res.status(UNAUTHORIZED).json(updateMessage(USER_MAY_NOT_CREATE_ANOTHER_ORGANISARION).user);
            // }

            // const organisationId = req.user?.organisation;
            // if (currentUser.organisation && organisationId === undefined) {
            // req.user.organisation = currentUser.organisation;
            // }

            // if (organisationId && currentUser.organisation.toString() !== organisationId) {
            // return res.status(UNAUTHORIZED).json(updateMessage(USER_IS_NOT_MEMBER_OF_THIS_ORGANISATION).user);
            // }

            // conditions === USER_PREF_ID && (req.bonus.prefId = currentUser.prefId);
            // conditions === ROLLS && (req.bonus.rolles = currentUser.rolls);

            // secondConditin === USER_PREF_ID && (req.bonus.prefId = currentUser.prefId);

        } catch (err) {
            // To Do verify or adding Sentry
            return res.status(400).json(updateMessage({ message: 'gg', messageCode: '2234', }).user);
        }

        next();
    };
};
