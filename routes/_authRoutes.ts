import { Router, } from 'express';
import { body, } from 'express-validator';

const auth = Router();

import { expressValidator, isAuthenticated, } from '../middleware';

import * as authController from '../controller/authController';
import { PASSWORD_PATTERN, ROUTING_MESSAGES, } from '../constants';


auth.post('/login',
    body('email').isEmail().withMessage(ROUTING_MESSAGES.EMAIL_IS_REQUIRED),
    body('password').notEmpty().withMessage(ROUTING_MESSAGES.PASSWORD_IS_REQUIRED),
    expressValidator,
    authController.getUser
);

auth.post('/register',
    body('email').isEmail().withMessage(ROUTING_MESSAGES.EMAIL_ADDRESS_INCORRECT),
    body('password').isLength({ min: 8, }).withMessage(ROUTING_MESSAGES.INVALID_PASSWORD).bail()
        .matches(PASSWORD_PATTERN).withMessage(ROUTING_MESSAGES.INCORRECT_TYPE_PASSWORD),
    body('year').notEmpty().withMessage(ROUTING_MESSAGES.YEARS_IS_REQUIRED),
    expressValidator,
    authController.createUser
);

auth.post('/logout', authController.exitUser);
auth.get('/check', authController.checkFields);

auth.post('/verify',
    body('verifyToken').notEmpty().withMessage(ROUTING_MESSAGES.TOKE_IS_REQUIRED),
    expressValidator,
    authController.verifyUser
);

auth.post('/magic-link',
    body('email').isEmail().withMessage(ROUTING_MESSAGES.EMAIL_ADDRESS_INCORRECT),
    expressValidator,
    authController.requestMagicLink
);

auth.post('/magic-link/verify',
    body('token').notEmpty().withMessage(ROUTING_MESSAGES.TOKE_IS_REQUIRED),
    expressValidator,
    authController.verifyMagicLink
);

auth.get('/profile', isAuthenticated(), authController.getProfile);

auth.patch('/profile',
    isAuthenticated(),
    body('readingGoal').optional().isInt({ min: 1, max: 999, }).withMessage(ROUTING_MESSAGES.READING_GOAL_RANGE),
    body('displayName').optional({ nullable: true }).isLength({ max: 60, })
        .withMessage(ROUTING_MESSAGES.DISPLAY_NAME_LENGTH),
    body('avatarFileId').optional({ nullable: true }).isInt(),
    body('notifyByEmail').optional().isBoolean().withMessage(ROUTING_MESSAGES.NOTIFY_BY_EMAIL_BOOL),
    expressValidator,
    authController.updateProfile
);

export default auth;