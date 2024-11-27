import { Router, } from 'express';
import { body, } from 'express-validator';

const product = Router();

import { expressValidator, isAuthenticated, cacheMiddleware, } from '../middleware';

import * as productController from '../controller/productController';
// FOR UPDATE
import * as bookStateController from '../controller/bookStateController';
import * as stateController from '../controller/stateController';

import { cacheKeys, ROUTING_MESSAGES, } from '../constants';


product.get('/',
    cacheMiddleware(cacheKeys.ALL_PRODUCTS),
    productController.getAllProducts
);

product.get('/:id',
    cacheMiddleware(cacheKeys.PRODUCT_ID),
    productController.getProductById
);

product.post('/',
    isAuthenticated(),
    body('productTitle').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.PRODUCT_TITLE_REQUIRED),
    body('author').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.AUTHOR_REQUIRED),
    body('genre').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.BOOK_GENRE),
    expressValidator,
    productController.createProduct
);

product.post('/addImage',
    isAuthenticated(),
    body('src').isLength({ min: 2, max: 145, }).withMessage(ROUTING_MESSAGES.FILE_NAME),
    body('fileId').isNumeric().withMessage(ROUTING_MESSAGES.PRODUCT_FIELD_ID),
    expressValidator,
    productController.addedImageOnProduct
);

product.delete('/removeImage/:id',
    isAuthenticated(),
    productController.removeImageOnProduct
);

// product.put('/:id',
//     isAuthenticated(),
//     productController.updateBook
// );
// product.delete('/:id',
//     isAuthenticated(),
//     productController.deleteBook
// );


// TO Book State Controller
product.get('/bookStates/all', stateController.getStates);
product.get('/booksState/:state', isAuthenticated(), bookStateController.getAllBooksByState);
product.get('/bookState/:id',
    isAuthenticated(),
    cacheMiddleware(cacheKeys.BOOK_STATE_ID),
    bookStateController.getBookStateById
);
product.post('/state/',
    isAuthenticated(),
    body('bookId').isLength({ min: 1, }).withMessage(ROUTING_MESSAGES.BOOK_ID_IS_REQUIRED),
    body('state').isFloat({ min: 1, max: 5, }).withMessage(ROUTING_MESSAGES.BOOK_COLLECTION_TYPE),
    expressValidator,
    bookStateController.createBookState
);


export default product;