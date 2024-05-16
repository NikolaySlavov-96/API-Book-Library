import { Router, } from 'express';
import { body, } from 'express-validator';

const withUser = Router();

import { expressValidator, } from '../middleware';

import * as apiController from '../controller/apiController';
// import { hasUser, } from '../middleware/guards';


withUser.get('/:type/',
    // hasUser(),
    apiController.getAllDate
);

withUser.get('/:type/:id',
    // hasUser(),
    apiController.getDateById
);

withUser.post('/:type',
    body('book_id').isNumeric().withMessage('Incorect input date'),
    expressValidator,
    // hasUser(),
    apiController.createBook
);

// withUser.put('/:type/:id',
//     hasUser(),
//     apiController.updateBook
// );

// withUser.delete('/:type/:id',
//     hasUser(),
//     apiController.deleteBook
// );

export default withUser;