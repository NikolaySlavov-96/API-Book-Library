import { Router } from 'express';
import { body } from 'express-validator';

const profile = Router();

import { ROUTING_MESSAGES } from '../constants';
import * as profileController from '../controller/profileController';
import { expressValidator, isAuthenticated } from '../middleware';

profile.get('/', isAuthenticated(), profileController.getProfile);

profile.patch(
    '/',
    isAuthenticated(),
    body('readingGoal').optional().isInt({ min: 1, max: 999 }).withMessage(ROUTING_MESSAGES.READING_GOAL_RANGE),
    body('displayName')
        .optional({ nullable: true })
        .isLength({ max: 60 })
        .withMessage(ROUTING_MESSAGES.DISPLAY_NAME_LENGTH),
    body('avatarFileId').optional({ nullable: true }).isInt(),
    body('notifyByEmail').optional().isBoolean().withMessage(ROUTING_MESSAGES.NOTIFY_BY_EMAIL_BOOL),
    expressValidator,
    profileController.updateProfile,
);

export default profile;
