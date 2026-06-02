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

    return attachStatusHistory(responseMapper(result, EMappedType.PRODUCT_STATE), userId);
};

export const attachStatusHistory = async (mapped, userId) => {
    if (!userId) {
        return mapped;
    }

    const rows = mapped.rows as Array<{ productId: number }>;
    const historyMap = await repositories.productStatus.findHistoryForProducts(
        userId,
        rows.map((row) => row.productId),
    );

    return {
        ...mapped,
        rows: rows.map((row) => ({ ...row, statusHistory: historyMap.get(row.productId) ?? [] })),
    };
};

export const getStatusCounts = async (userId) => {
    return repositories.productStatus.findStatusCounts(userId);
};

export const getInfoFromProductStatus = async (productId, userId) => {
    const [existing, statusHistory] = await Promise.all([
        repositories.productStatus.findOneActive(productId, userId),
        repositories.productStatus.findHistoryForProduct(userId, productId),
    ]);

    return { statusId: existing?.statusId ?? null, statusHistory };
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

    if (existing && existing.statusId === Number(statusId)) {
        return;
    }

    if (existing) {
        await repositories.productStatus.updateStatusId(existing.id, statusId);
    } else {
        await repositories.productStatus.create({ userId, productId, statusId });
    }

    await repositories.productStatus.addStatusHistory(userId, productId, statusId);
};
