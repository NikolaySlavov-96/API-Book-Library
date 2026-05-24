import { repositories } from '../repositories';

export const upsertRating = async (userId, { productId, rating }) => {
    return repositories.productRating.upsert({ userId, productId, rating });
};

export const getRatingAggregate = async (productId) => {
    return repositories.productRating.getAggregate(productId);
};

export const getUserRating = async (userId, productId) => {
    return repositories.productRating.getUserRating(userId, productId);
};
