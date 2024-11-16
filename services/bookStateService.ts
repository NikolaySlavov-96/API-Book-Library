import { responseMapper, EMappedType, } from '../Helpers';

import db from '../Model';
const Op = db?.Sequelize?.Op;

export const getAllDate = async ({ state, userId, offset, limit, filterOperator, searchContent, }) => {
    const queryOperator = Op[filterOperator];
    const hasSearchContent = !!searchContent;

    const query = {
        where: { stateId: state, userId, },
        include: [
            {
                model: db.Book,
                required: true,
                attributes: ['id', 'bookTitle', 'genre', 'isVerify', 'authorId'],
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
                            bookTitle: { [queryOperator]: searchContent, },
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
        attributes: ['id', 'stateId', 'isDelete'],
        order: [['id', 'ASC']],
        offset,
        limit,
        raw: true,
        nest: true,
    };

    const result = await db.BookState.findAndCountAll(query);

    const mappedResponse = responseMapper(result, EMappedType.PRODUCT_STATE);

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