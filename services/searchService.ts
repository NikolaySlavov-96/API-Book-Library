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
                        attributes: ['id', 'productTitle', 'genre', 'isVerify', 'authorId'],
                        include: [
                            {
                                model: db.Author,
                                attributes: ['name', 'image', 'genre', 'isVerify'],
                            },
                            {
                                model: db.File,
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
        offset,
        limit,
        raw: true,
        nest: true,
    });

    const mappedResponse = responseMapper(result, EMappedType.PRODUCT_SEARCH);

    return mappedResponse;
};