import { EMappedType, responseMapper } from '../Helpers';
import { repositories } from '../repositories';

export const getAllStates = async () => {
    return repositories.state.findAll();
};

export const getStateById = async (statusId) => {
    return repositories.state.findById(parseInt(statusId));
};

export const getAllDate = async ({ statusId, userId, offset, limit, filterOperator, searchContent }) => {
    const numericStatusId = parseInt(statusId);

    const result = await repositories.productStatus.findAndCount({
        statusId: numericStatusId || null,
        userId,
        offset,
        limit,
        filterOperator,
        searchContent,
    });

    return responseMapper(result, EMappedType.PRODUCT_STATE);
};

export const getStatusCounts = async (userId) => {
    return repositories.productStatus.findStatusCounts(userId);
};

export const getInfoFromProductStatus = async (productId, userId) => {
    return repositories.productStatus.findOneActive(productId, userId);
};

export const removeProductStatus = async (userId, productId) => {
    const existing = await repositories.productStatus.findOneActive(productId, userId);
    if (!existing) {
        return null;
    }
    return repositories.productStatus.markDeleted(existing.id);
};

export const addingNewProductStatus = async (userId, { productId, statusId }) => {
    const existing = await repositories.productStatus.findOneActive(productId, userId);

    if (existing) {
        return repositories.productStatus.updateStatusId(existing.id, statusId);
    }

    return repositories.productStatus.create({ userId, productId, statusId });
};
