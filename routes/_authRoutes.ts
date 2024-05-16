import { Router, } from 'express';
import { body, } from 'express-validator';

const auth = Router();

import { expressValidator, } from '../middleware';

import * as authController from '../controller/authController';


auth.post('/login',
    body('email').isEmail().withMessage('Email is requied'),
    body('password').notEmpty().withMessage('Passwor is required'),
    expressValidator,
    authController.getUser
);
auth.post('/register',
    body('email').isEmail().withMessage('Emais is not corret'),
    body('password').isLength({ min: 8, }).withMessage('Invalid password').bail()
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/).withMessage('Incorrect type of password'),
    body('rePassword').custom((value, { req, }) => {
        return value == req.body.password;
    }).withMessage('Password missmatch!'),
    body('year').notEmpty().withMessage('Years is requited'),
    expressValidator,
    authController.createUser
);
auth.post('/logout', authController.exitUset);
auth.get('/check', authController.checkFields);

auth.post('/verify',
    body('verifyToken').notEmpty().withMessage('Verify Token is required'),
    expressValidator,
    authController.verifyUser
);

export default auth;