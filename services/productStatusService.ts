import { responseMapper, EMappedType, } from '../Helpers';

import db from '../Model';
const Op = db?.Sequelize?.Op;

export const getAllStates = async () => {
    return await db.State.findAll();
};

export const getAllDate = async ({ statusId, userId, offset, limit, filterOperator, searchContent, }) => {
    const queryOperator = Op[filterOperator];
    const hasSearchContent = !!searchContent;

    // statusId 0 / falsy → "all" tab: return every shelf item for the user
    const numericStatusId = parseInt(statusId);
    const statusFilter = numericStatusId ? { statusId: numericStatusId, } : {};

    const query = {
        where: { ...statusFilter, userId, isDelete: false, },
        include: [
            {
                model: db.Product,
                required: true,
                attributes: ['id', 'productTitle', 'genre', 'isVerify'],
                as: 'Product',
                include: [
                    {
                        model: db.File,
                        required: false,
                        as: 'files',
                        attributes: ['id', 'src', 'uniqueName'],
                    },
                    {
                        model: db.Author,
                        as: 'authors',
                        attributes: ['name', 'image', 'isVerify', 'genre'],
                    }
                ],
                where: hasSearchContent ? {
                    [Op.or]: [
                        {
                            productTitle: { [queryOperator]: searchContent, },
                        },
                        {
                            genre: { [queryOperator]: searchContent, },
                        }
                    ],
                } : {},
            },
            {
                model: db.User as 'user',
                required: true,
                attributes: ['email', 'id'],
            },
            {
                model: db.State,
                required: true,
                attributes: ['stateName'],
            }
        ],
        attributes: ['id', 'statusId', 'isDelete'],
        order: [['id', 'ASC']],
        offset,
        distinct: true,
        limit,
    };

    const result = await db.ProductStatus.findAndCountAll(query);

    const mappedResponse = responseMapper(result, EMappedType.PRODUCT_STATE);

    return mappedResponse;
};

export const getStatusCounts = async (userId) => {
    const rows = await db.ProductStatus.findAll({
        where: { userId, isDelete: false, },
        attributes: [
            'statusId',
            [db.sequelize.fn('COUNT', db.sequelize.col('statusId')), 'count']
        ],
        group: ['statusId'],
        raw: true,
    });

    return rows.map((r) => ({ statusId: Number(r.statusId), count: Number(r.count), }));
};

export const getInfoFromProductStatus = async (productId, userId) => {
    return await db.ProductStatus.findOne({
        where: { productId, userId, isDelete: false, },
        attributes: ['statusId'],
    });
};

export const removeProductStatus = async (userId, productId) => {
    const row = await db.ProductStatus.findOne({ where: { productId, userId, isDelete: false, }, });
    if (!row) {
        return null;
    }
    row.isDelete = true;
    return await row.save();
};

export const addingNewProductStatus = async (userId, { productId, statusId, }) => {
    const existingProduct = await db.ProductStatus.findOne({ where: { productId, userId, isDelete: false, }, });

    if (existingProduct) {
        existingProduct.statusId = statusId;
        return await existingProduct.save();
    }

    const result = (await db.ProductStatus.create({ userId, productId, statusId, }))?.dataValues;
    return result;
};