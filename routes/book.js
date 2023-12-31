const book = require('express').Router();

const apiController = require('../controller/apiController');
const { hasUser } = require('../middleware/guards');


book.get('/:type/', apiController.getAllDate);
book.get('/:type/:id', apiController.getDateById);
book.post('/:type',
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