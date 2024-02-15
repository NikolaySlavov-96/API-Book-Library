const auth = require('express').Router();
const { body } = require('express-validator');

const authController = require('../controller/authController');


auth.post('/login',
    body('email').isEmail().withMessage('Email is requied'),
    body('password').notEmpty().withMessage('Passwor is required'),
    authController.getUser
);
auth.post('/register',
    body('email').isEmail().withMessage('Emais is not corret'),
    body('password').isLength({ min: 8 }).withMessage('Invalid password').bail()
        .matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])((?=.*\W)|(?=.*_))^[^ ]+$/).withMessage('Incorrect type of password'),
    body('rePassword').custom((value, { req }) => {
        return value == req.body.password;
    }).withMessage('Password missmatch!'),
    body('year').notEmpty().withMessage('Years is requited'),
    authController.createUser
);
auth.post('/logout', authController.exitUset);
auth.get('/check', authController.checkFields);

auth.post('/verify',
    body('verifyToken').notEmpty().withMessage('Verify Token is required'),
    authController.verifyUser
);

module.exports = auth;