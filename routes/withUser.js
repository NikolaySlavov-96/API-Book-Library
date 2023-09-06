const withUser = require('express').Router();

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