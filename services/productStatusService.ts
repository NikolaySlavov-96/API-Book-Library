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

    return attachStatusCounts(responseMapper(result, EMappedType.PRODUCT_STATE), userId);
};

export const attachStatusCounts = async (mapped, userId) => {
    if (!userId) {
        return mapped;
    }

    const rows = mapped.rows as Array<{ productId: number }>;
    const countsMap = await repositories.productStatus.findCountsForProducts(
        userId,
        rows.map((row) => row.productId),
    );

    return {
        ...mapped,
        rows: rows.map((row) => ({ ...row, statusCounts: countsMap.get(row.productId) ?? [] })),
    };
};

export const getStatusCounts = async (userId) => {
    return repositories.productStatus.findStatusCounts(userId);
};

export const getInfoFromProductStatus = async (productId, userId) => {
    const [existing, statusCounts] = await Promise.all([
        repositories.productStatus.findOneActive(productId, userId),
        repositories.productStatus.findCountsForProduct(userId, productId),
    ]);

    return { statusId: existing?.statusId ?? null, statusCounts };
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

    if (!existing) {
        await repositories.productStatus.create({ userId, productId, statusId });
    } else if (existing.statusId !== Number(statusId)) {
        await repositories.productStatus.updateStatusId(existing.id, statusId);
    }

    await repositories.productStatus.incrementStatusCount(userId, productId, statusId);
};
