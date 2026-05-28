import { cacheKeys } from '../constants';
import { deleteKeysWithPrefix } from '../services/cacheService';
import * as productService from '../services/productService';

export const createBulkProducts = async ({ products }) => {
    const productsId = [];
    // TODO(lint): batch with Promise.all to create products in parallel (no-await-in-loop).
    for (const product of products) {
        const productResponse = await productService.create(product);
        if (productResponse.statusCode) {
            continue;
        }
        productsId.push(productResponse.id);
    }

    await deleteKeysWithPrefix(cacheKeys.ALL_PRODUCTS);

    return productsId;
};
