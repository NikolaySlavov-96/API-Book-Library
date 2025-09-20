import { EMappedType, responseMapper, } from '../Helpers';

import db from '../Model';

export const getProductsByEmail = async ({ email, offset, limit, }) => {
    const result = await db.User.findAndCountAll({
        include: [
            {
                model: db.ProductStatus,
                attributes: ['id', 'productId'],
                include: [
                    {
                        model: db.Product,
                        attributes: ['id', 'productTitle', 'genre', 'isVerify'],
                        as: 'Product',
                        include: [
                            {
                                model: db.Author,
                                as: 'authors',
                                attributes: ['name', 'image', 'genre', 'isVerify'],
                            },
                            {
                                model: db.File,
                                required: false,
                                as: 'files',
                                attributes: ['id', 'src', 'uniqueName'],
                            }
                        ],
                    }
                ],
            }
        ],
        where: { email, },
        attributes: ['id', 'email', 'year', 'isVerify'],
        order: [['id', 'ASC']],
        distinct: true,
        offset,
        limit,
    });

    const mappedResponse = responseMapper(result, EMappedType.PRODUCT_SEARCH);

    return mappedResponse;
};