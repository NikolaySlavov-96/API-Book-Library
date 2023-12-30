const book = require('express').Router();
const { body } = require('express-validator');

const apiController = require('../controller/apiController');
const { hasUser } = require('../middleware/guards');


book.get('/:type/', apiController.getAllDate);
book.get('/:type/:id', apiController.getDateById);
book.post('/:type',
    body('booktitle').isLength({ min: 2 }).withMessage('Book Title is required'),
    body('author').isLength({ min: 2 }).withMessage('Author is required'),
    hasUser(),
    apiController.createBook
);

book.put('/:type/:id',
    hasUser(),
    apiController.updateBook
);

book.delete('/:type/:id',
    hasUser(),
    apiController.deleteBook
);



module.exports = book;