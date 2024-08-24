import { Router, } from 'express';
import { body, } from 'express-validator';

const bookState = Router();

import { expressValidator, hasUser, } from '../middleware';

import * as bookStateController from '../controller/bookStateController';

import { ROUTING_MESSAGES, } from '../constants';


bookState.get('/:state', bookStateController.getAllBooksByState);
bookState.get('/:id', bookStateController.getBooksById);
bookState.post('/',
    hasUser(),
    body('bookId').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.BOOK_ID_IS_REQUIRED),
    expressValidator,
    bookStateController.createBookState
);

export default bookState;