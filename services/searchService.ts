import { EMappedType, responseMapper } from '../Helpers';
import { repositories } from '../repositories';

export const getProductsByEmail = async ({ email, offset, limit }) => {
    const result = await repositories.productStatus.findByUserEmail({ email, offset, limit });
    return responseMapper(result, EMappedType.PRODUCT_SEARCH);
};
