const withUser = require('express').Router();
const { body } = require('express-validator');

const apiController = require('../controller/apiController');
const { hasUser } = require('../middleware/guards');


withUser.get('/:type/',
    hasUser(),
    apiController.getAllDate
);

withUser.get('/:type/:id',
    hasUser(),
    apiController.getDateById
);

withUser.post('/:type',
    body('book_id').isNumeric().withMessage('Incorect input date'),
    hasUser(),
    apiController.createBook
);

withUser.put('/:type/:id',
    hasUser(),
    apiController.updateBook
);

withUser.delete('/:type/:id',
    hasUser(),
    apiController.deleteBook
);

module.exports = withUser;