import { EMappedType, responseMapper, } from '../Helpers';

import db from '../Model';

const Op = db?.Sequelize?.Op;

const ATTRIBUTES = ['name', 'image', 'genre', 'isVerify'];

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

export const searchBook = async ({ offset, limit, typeSearch, searchContent, }) => {
    const query = {
        include: [{
            model: db.Author,
            required: false,
            attributes: ATTRIBUTES,
        }],
        order: [['id', 'ASC']],
        attributes: ['id', 'bookTitle', 'image', 'genre', 'isVerify'],
        offset,
        limit,
        where: {},
    };

    const typeOf = {
        'Op.like': Op.like,
    };

    typeSearch && (query.where = {
        [Op.or]: [
            {
                bookTitle: { [typeOf[typeSearch]]: searchContent, },
            },
            {
                genre: { [typeOf[typeSearch]]: searchContent, },
            },
            {
                '$Author.name$': { [typeOf[typeSearch]]: searchContent, },
            }
        ],

    });

    const result = await db.Book.findAndCountAll(query);

    return result;
};