const book = require('express').Router();

const bookController = require('../controller/bookController');


book.get('/', bookController.getAllDate);
book.get('/:id', bookController.getDateById);
book.post('/', bookController.createBook);
book.put('/:id', bookController.updateBook);
book.delete('/:id', bookController.deleteBook);


module.exports = book;