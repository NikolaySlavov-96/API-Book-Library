import { Router, } from 'express';
import { body, } from 'express-validator';

const product = Router();

import { expressValidator, isAuthenticated, cacheMiddleware, } from '../middleware';

import * as productController from '../controller/productController';
import * as productStatusController from '../controller/productStatusController';

import { cacheKeys, ROUTING_MESSAGES, } from '../constants';


product.get('/',
    cacheMiddleware(cacheKeys.ALL_PRODUCTS),
    productController.getAllProducts
);
product.get('/status/all', productStatusController.getAllStatus);

product.get('/:id',
    cacheMiddleware(cacheKeys.PRODUCT_ID),
    productController.getProductById
);
product.get('/:id/status',
    isAuthenticated(),
    cacheMiddleware(cacheKeys.PRODUCT_STATUS_ID),
    productStatusController.getProductStatusById
);
// Get all product By specific status
product.get('/status/:statusId', isAuthenticated(), productStatusController.getAllProductsByStatus);

product.post('/',
    isAuthenticated(),
    body('productTitle').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.PRODUCT_TITLE_REQUIRED),
    body('author').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.AUTHOR_REQUIRED),
    body('genre').isLength({ min: 2, }).withMessage(ROUTING_MESSAGES.PRODUCT_GENRE),
    expressValidator,
    productController.createProduct
);
product.post('/status/',
    isAuthenticated(),
    body('productId').isLength({ min: 1, }).withMessage(ROUTING_MESSAGES.PRODUCT_ID_IS_REQUIRED),
    body('status').isFloat({ min: 1, max: 5, }).withMessage(ROUTING_MESSAGES.PRODUCT_COLLECTION_TYPE),
    expressValidator,
    productStatusController.createProductStatus
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


export default product;