import { EMappedType, responseMapper, } from '../Helpers';

import db from '../Model';

export const getBookByEmail = async ({ email, offset, limit, }) => {
    const result = await db.User.findAndCountAll({
        include: [
            {
                model: db.BookState,
                attributes: ['id', 'bookId'],
                include: [
                    {
                        model: db.Book,
                        attributes: ['id', 'bookTitle', 'image', 'genre', 'isVerify'],
                        include: [
                            {
                                model: db.Author,
                                attributes: ['name', 'image', 'genre', 'isVerify'],
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

    const mappedResponse = responseMapper(result, EMappedType.BOOK_SEARCH);

    return mappedResponse;
};