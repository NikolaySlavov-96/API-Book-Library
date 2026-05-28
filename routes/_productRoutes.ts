import { Router } from 'express';
import { body } from 'express-validator';

const product = Router();

import { cacheKeys, ROUTING_MESSAGES } from '../constants';
import * as productController from '../controller/productController';
import * as productRatingController from '../controller/productRatingController';
import * as productStatusController from '../controller/productStatusController';
import { cacheMiddleware, expressValidator, isAuthenticated } from '../middleware';

product.get('/', cacheMiddleware(cacheKeys.ALL_PRODUCTS), productController.getAllProducts);
product.get('/status/all', productStatusController.getAllStatus);
product.get('/status/counts', isAuthenticated(), productStatusController.getStatusCounts);

product.get('/:id', cacheMiddleware(cacheKeys.PRODUCT_ID), productController.getProductById);
product.get(
    '/:id/status',
    isAuthenticated(),
    cacheMiddleware(cacheKeys.PRODUCT_STATUS_ID),
    productStatusController.getProductStatusById,
);

// Rating: aggregate (+ current user's rating when logged in)
product.get('/:id/rating', productRatingController.getProductRating);
product.post(
    '/:id/rating',
    isAuthenticated(),
    body('rating').isFloat({ min: 1, max: 5 }).withMessage(ROUTING_MESSAGES.RATING_RANGE),
    expressValidator,
    productRatingController.rateProduct,
);
// Get all product By specific status
product.get('/status/:statusId', isAuthenticated(), productStatusController.getAllProductsByStatus);

product.post(
    '/',
    isAuthenticated(),
    body('productTitle').isLength({ min: 2 }).withMessage(ROUTING_MESSAGES.PRODUCT_TITLE_REQUIRED),
    body('authors').isArray({ min: 1 }).withMessage(ROUTING_MESSAGES.AUTHOR_REQUIRED),
    body('authors.*').isString().isLength({ min: 2 }).withMessage(ROUTING_MESSAGES.AUTHOR_REQUIRED),
    body('genre').isLength({ min: 2 }).withMessage(ROUTING_MESSAGES.PRODUCT_GENRE),
    body('pages').optional({ nullable: true }).isInt({ min: 1 }).withMessage(ROUTING_MESSAGES.PRODUCT_PAGES),
    body('publishedYear')
        .optional({ nullable: true })
        .isInt({ min: 0, max: 3000 })
        .withMessage(ROUTING_MESSAGES.PRODUCT_PUBLISHED_YEAR),
    body('description')
        .optional({ nullable: true })
        .isLength({ max: 4000 })
        .withMessage(ROUTING_MESSAGES.PRODUCT_DESCRIPTION),
    body('authorsSeparator')
        .optional({ nullable: true })
        .isString()
        .isLength({ min: 1, max: 8 })
        .withMessage(ROUTING_MESSAGES.AUTHORS_SEPARATOR),
    expressValidator,
    productController.createProduct,
);

product.post(
    '/status/',
    isAuthenticated(),
    body('productId').isLength({ min: 1 }).withMessage(ROUTING_MESSAGES.PRODUCT_ID_IS_REQUIRED),
    body('statusId').isFloat({ min: 1, max: 5 }).withMessage(ROUTING_MESSAGES.PRODUCT_COLLECTION_TYPE),
    expressValidator,
    productStatusController.createProductStatus,
);

// Remove (soft-delete) a product from the user's shelf
product.delete('/status/:productId', isAuthenticated(), productStatusController.deleteProductStatus);

export default product;
