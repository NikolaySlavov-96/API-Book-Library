import { Router, } from 'express';
import { body, } from 'express-validator';

const book = Router();

import { expressValidator, hasUser, } from '../middleware';

import * as apiController from '../controller/apiController';
import * as bookController from '../controller/bookController';

import { ROUTING_MESSAGES, } from '../constants';


book.get('/', bookController.getAllBooks);
book.get('/:id', bookController.getBookById);
book.post('/',
    hasUser(),
    body('booktitle').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.BOOK_TITLE_REQUIRED),
    body('author').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.AUTHOR_REQUIRED),
    expressValidator,
    bookController.createBook
);
// book.put('/:id',
//     hasUser(),
//     bookController.updateBook
// );
// book.delete('/:id',
//     hasUser(),
//     bookController.deleteBook
// );


book.get('/:type/', apiController.getAllDate);
book.get('/:type/:id', apiController.getDateById);
book.post('/:type',
    hasUser(),
    body('booktitle').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.BOOK_TITLE_REQUIRED),
    body('author').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.AUTHOR_REQUIRED),
    expressValidator,
    apiController.createBook
);

export default book;