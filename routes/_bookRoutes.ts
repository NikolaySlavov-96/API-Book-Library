import { Router, } from 'express';
import { body, } from 'express-validator';

const book = Router();

import { expressValidator, isAuthenticated, } from '../middleware';

import * as bookController from '../controller/bookController';
import * as bookStateController from '../controller/bookStateController';
import * as stateController from '../controller/stateController';

import { ROUTING_MESSAGES, } from '../constants';


book.get('/', bookController.getAllBooks);
book.get('/:id', bookController.getBookById);
book.post('/',
    isAuthenticated(),
    body('bookTitle').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.BOOK_TITLE_REQUIRED),
    body('author').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.AUTHOR_REQUIRED),
    expressValidator,
    bookController.createBook
);
// book.put('/:id',
//     isAuthenticated(),
//     bookController.updateBook
// );
// book.delete('/:id',
//     isAuthenticated(),
//     bookController.deleteBook
// );


// TO Book State Controller
book.get('/bookStates/all', stateController.getStates);
book.get('/booksState/:state', isAuthenticated(), bookStateController.getAllBooksByState);
book.get('/bookState/:id', isAuthenticated(), bookStateController.getBookStateById);
book.post('/state/',
    isAuthenticated(),
    body('bookId').isLength({ min: 1, }).withMessage(ROUTING_MESSAGES.BOOK_ID_IS_REQUIRED),
    body('state').isFloat({ min: 1, max: 5, }).withMessage(ROUTING_MESSAGES.BOOK_COLLECTION_TYPE),
    expressValidator,
    bookStateController.createBookState
);


export default book;