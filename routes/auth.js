const auth = require('express').Router();

const authController = require('../controller/authController');


auth.post('/login', authController.getUser);
auth.post('/register', authController.createUser);
auth.post('/logout', authController.exitUset);
auth.get('/check', authController.checkFields);

module.exports = auth;