const seach = require('express').Router();
const { body } = require('express-validator');

const searchController = require('../controller/searchController');


seach.get('/view',
    searchController.viewUserBooksFromEmail
);

module.exports = seach;