import { EMappedType, responseMapper } from '../Helpers';
import db from '../Model';

export const getProductsByEmail = async ({ email, offset, limit }) => {
    const result = await db.ProductStatus.findAndCountAll({
        where: { isDelete: false },
        include: [
            {
                model: db.User,
                required: true,
                where: { email },
                attributes: ['id', 'email', 'isVerify'],
                include: [
                    {
                        model: db.Profile,
                        as: 'profile',
                        required: false,
                        attributes: ['year'],
                    },
                ],
            },
            {
                model: db.Product,
                as: 'Product',
                required: true,
                attributes: ['id', 'productTitle', 'genre', 'isVerify'],
                include: [
                    {
                        model: db.Author,
                        as: 'authors',
                        attributes: ['name', 'genre', 'isVerify'],
                    },
                    {
                        model: db.File,
                        required: false,
                        as: 'files',
                        attributes: ['id', 'src', 'uniqueName'],
                    },
                ],
            },
        ],
        attributes: ['id', 'statusId', 'productId'],
        order: [['id', 'ASC']],
        distinct: true,
        offset,
        limit,
    });

    const mappedResponse = responseMapper(result, EMappedType.PRODUCT_SEARCH);

    return mappedResponse;
};
