import { Router, } from 'express';
import { body, } from 'express-validator';

const bookState = Router();

import { expressValidator, } from '../middleware';

import * as bookStateController from '../controller/bookStateController';

import { ROUTING_MESSAGES, } from '../constants';


bookState.get('/:state', bookStateController.getAllBooksByState);
bookState.post('/',
    body('bookId').isLength({ min: 1, }).withMessage(ROUTING_MESSAGES.BOOK_ID_IS_REQUIRED),
    body('state').isLength({ min: 3 }), // TODO Adding message 
    expressValidator,
    bookStateController.createBookState
);

export default bookState;