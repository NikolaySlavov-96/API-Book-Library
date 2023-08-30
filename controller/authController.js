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
        const { email, password, year } = body;

        const param = {
            check: [email],
            register: [email, password, year]
        };
        const query = {
            check: 'SELECT email FROM account WHERE email = $1',
            register: `INSERT INTO account (email, password, year) VALUES ($1, $2, $3) RETURNING *;`
        }
        const token = await register(query, param);
        res.json(token);
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
        const { email } = req.body;
        const param = [email];
        const query = 'SELECT email, password, id, year FROM account WHERE email = $1';
        const token = await login(query, param, req.body);
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
        console.log(err);
    }
}

const checkFields = async (req, res) => {
    const { email } = req.query;
    const value = Object.keys(req.query)[0]
    const query = `SELECT COUNT(email) FROM account WHERE ${value} = $1`;
    try {
        const result = await checkFieldInDB(query, [email]);
        res.json(result.rows[0].count);
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