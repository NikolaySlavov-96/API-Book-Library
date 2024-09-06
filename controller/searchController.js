const { validationResult } = require('express-validator');

const { getBookByEmail } = require('../services/searchService');
const { errorParser } = require('../util/parser');


const viewUserBooksFromEmail = async (req, res, next) => {
    const { errors } = validationResult(req);
    try {
        if (errors.length > 0) {
            throw errors;
        }
        const page = parseInt(req?.query?.page) || 1;
        const limit = parseInt(req?.query?.limit) || 10;
        const skipSource = (page - 1) * limit;
        
        const books = await getBookByEmail();
        res.json(books);
    } catch (err) {

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


module.exports = {
    viewUserBooksFromEmail,
}