import { responseMapper, EMappedType, } from '../Helpers';

import db from '../Model';

export const getAllDate = async ({ state, userId, offset, limit, }) => {
    const result = await db.BookState.findAndCountAll({
        include: [
            {
                model: db.Book as 'book',
                required: true,
                attributes: ['id', 'bookTitle', 'image', 'genre', 'isVerify'],
                include: {
                    model: db.Author as 'author',
                    attributes: ['name', 'image', 'isVerify', 'genre'],
                },
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
        where: { stateId: state, userId, },
        attributes: ['id', 'stateId', 'isDelete'],
        order: [['id', 'ASC']],
        offset,
        limit,
        raw: true,
        nest: true,
    });

    const mappedResponse = responseMapper(result, EMappedType.BOOK_STATE);

    return mappedResponse;
};

export const getInfoFromBookState = async (bookId, userId) => {
    return await db.BookState.findOne({
        where: { bookId, userId, isDelete: false, },
        attributes: ['stateId'],
    });
};

export const addingNewBookState = async ({ userId, bookId, state, }) => {
    const existingBook = await db.BookState.findOne({ where: { bookId, userId, isDelete: false, }, });

    if (existingBook) {
        existingBook.stateId = state;
        return await existingBook.save();
    }

    const result = (await db.BookState.create({ userId, bookId, stateId: state, }))?.dataValues;
    return result;
};