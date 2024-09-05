import { database, } from '../config';
import { TABLE_NAME } from '../constants';
import { db } from '../util';

const User = database?.userModel;
const Book = database?.bookModel;
const Author = database?.authorModel;


export const getAllDate = async ({ state, user_id, offset, limit, }) => {
    const response = await db(TABLE_NAME.BOOK_STATE).findAndCountAll({
        include: [{
            model: Book,
            required: true,
            attributes: ['id', 'booktitle', 'image', 'genre', 'isVerify'],
            include: {
                model: Author,
                attributes: ['name', 'image', 'isVerify', 'genre'],
            },
        },
        {
            model: User,
            required: true,
            attributes: ['email', 'id'],
        }],
        where: { book_state: state, user_id, },
        attributes: ['id', 'book_state', 'isDelete'],
        order: [['id', 'ASC']],
        offset,
        limit,
    });

    return response;
};

export const getInfoFromBookState = async (book_id, user_id) => {
    return db(TABLE_NAME.BOOK_STATE).findOne({
        where: { book_id, user_id, isDelete: false, }, attributes: ['book_state'],
    });
};

export const addingNewBookState = async ({ user_id, book_id, state, }) => {
    const existingBook = await db(TABLE_NAME.BOOK_STATE).findOne({ where: { book_id, user_id, isDelete: false, }, });
    if (existingBook) {
        existingBook.book_state = state;
        return await existingBook.save();
    }
    return await db(TABLE_NAME.BOOK_STATE).create({ user_id, book_id, book_state: state, });
};