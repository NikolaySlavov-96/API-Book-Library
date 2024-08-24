import { Router, } from 'express';
import { body, } from 'express-validator';

const withUser = Router();

import { expressValidator, } from '../middleware';

import * as apiController from '../controller/apiController';
import { ROUTING_MESSAGES, } from '../constants';


withUser.get('/:type/',
    apiController.getAllDate
);

withUser.get('/:type/:id',
    apiController.getDateById
);

withUser.post('/:type',
    body('book_id').isNumeric().withMessage(ROUTING_MESSAGES.INCORRECT_INPUT_DATE),
    expressValidator,
    apiController.createBook
);

// withUser.put('/:type/:id',
//     apiController.updateBook
// );

// withUser.delete('/:type/:id',
//     apiController.deleteBook
// );

export default withUser;