import { Router, } from 'express';
import { body, } from 'express-validator';

const book = Router();

import { expressValidator, isAuthenticated, cacheMiddleware, } from '../middleware';

import * as bookController from '../controller/bookController';
import * as bookStateController from '../controller/bookStateController';
import * as stateController from '../controller/stateController';

import { cacheKeys, ROUTING_MESSAGES, } from '../constants';


book.get('/',
    cacheMiddleware(cacheKeys.ALL_BOOKS),
    bookController.getAllBooks
);

book.get('/:id',
    cacheMiddleware(cacheKeys.BOOK_ID),
    bookController.getBookById
);

book.post('/',
    isAuthenticated(),
    body('productTitle').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.BOOK_TITLE_REQUIRED),
    body('author').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.AUTHOR_REQUIRED),
    body('genre').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.BOOK_GENRE),
    expressValidator,
    bookController.createBook
);

book.post('/addImage',
    isAuthenticated(),
    body('src').isLength({ min: 2, max: 145, }).withMessage(ROUTING_MESSAGES.FILE_NAME),
    body('fileId').isNumeric().withMessage(ROUTING_MESSAGES.BOOK_FIELD_ID),
    expressValidator,
    bookController.addedImageOnBook
);

book.delete('/removeImage/:id',
    isAuthenticated(),
    bookController.removeImageOnBook
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
book.get('/bookState/:id',
    isAuthenticated(),
    cacheMiddleware(cacheKeys.BOOK_STATE_ID),
    bookStateController.getBookStateById
);
book.post('/state/',
    isAuthenticated(),
    body('bookId').isLength({ min: 1, }).withMessage(ROUTING_MESSAGES.BOOK_ID_IS_REQUIRED),
    body('state').isFloat({ min: 1, max: 5, }).withMessage(ROUTING_MESSAGES.BOOK_COLLECTION_TYPE),
    expressValidator,
    bookStateController.createBookState
);


export default book;