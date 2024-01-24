const { validationResult } = require('express-validator');

const { register, login, logout, checkFieldInDB } = require('../services/authService');
const { errorParser } = require('../util/parser');


const createUser = async (req, res) => {
    const { errors } = validationResult(req);
    try {
        if (errors.length > 0) {
            throw errors
        }
        const body = req.body;
        if (body.password !== body.rePassword) {
            throw new Error('Password not\t match');
        }
        const msg = await register(body);
        res.status(201).json(msg);
    } catch (err) {
        const message = errorParser(err);
        res.status(400).json({ message });
    }
}

const getUser = async (req, res) => {
    const { errors } = validationResult(req);
    try {
        if (errors.length > 0) {
            throw errors
        }
        const token = await login(req.body);
        res.json(token);
    } catch (err) {
        const message = errorParser(err);
        res.status(400).json({ message })
    }
}

const exitUset = async (req, res) => {
    const token = req.token;
    try {
        const data = await logout(token);
        res.status(204).end();
    } catch (err) {
        const message = errorParser(err);
        res.status(400).json({ message })
    }
}

const checkFields = async (req, res) => {
    const { email } = req.query;
    try {
        const result = await checkFieldInDB(email);
        res.json(result);
    } catch (err) {
        const message = errorParser(err);
        res.status(400).json({ message });
    }
}

module.exports = {
    createUser,
    getUser,
    exitUset,
    checkFields,
}