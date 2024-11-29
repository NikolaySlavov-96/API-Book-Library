import { responseMapper, EMappedType, } from '../Helpers';

import db from '../Model';
const Op = db?.Sequelize?.Op;

export const getAllStates = async () => {
    return await db.State.findAll();
};

export const getAllDate = async ({ statusId, userId, offset, limit, filterOperator, searchContent, }) => {
    const queryOperator = Op[filterOperator];
    const hasSearchContent = !!searchContent;

    const query = {
        where: { statusId, userId, },
        include: [
            {
                model: db.Product,
                required: true,
                attributes: ['id', 'productTitle', 'genre', 'isVerify', 'authorId'],
                include: [
                    {
                        model: db.File,
                        attributes: ['id', 'src', 'uniqueName'],
                    },
                    {
                        model: db.Author,
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
        limit,
        raw: true,
        nest: true,
    };

    const result = await db.ProductStatus.findAndCountAll(query);

    const mappedResponse = responseMapper(result, EMappedType.PRODUCT_STATE);

    return mappedResponse;
};

export const getInfoFromProductStatus = async (productId, userId) => {
    return await db.ProductStatus.findOne({
        where: { productId, userId, isDelete: false, },
        attributes: ['statusId'],
    });
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