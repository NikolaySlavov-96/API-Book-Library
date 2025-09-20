import * as productService from '../services/productService';
import { deleteKeysWithPrefix, } from '../services/cacheService';

import { cacheKeys, } from '../constants';

export const createBulkProducts = async ({ products, }) => {
    const productsId = [];
    for (const product of products) {
        try {
            const productResponse = await productService.create(product);
            if (productResponse.statusCode) {
                continue;
            }
            productsId.push(productResponse.id);
        } catch (err) { }
    }

    await deleteKeysWithPrefix(cacheKeys.ALL_PRODUCTS);

    return productsId;
};