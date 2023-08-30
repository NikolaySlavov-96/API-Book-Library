const book = require('express').Router();

const apiController = require('../controller/apiController');


book.get('/:type/', apiController.getAllDate);
book.get('/:type/:id', apiController.getDateById);
book.post('/:type', apiController.createBook);
book.put('/:type/:id', apiController.updateBook);
book.delete('/:type/:id', apiController.deleteBook);


module.exports = book;