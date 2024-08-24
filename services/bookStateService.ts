import { database, } from '../config';

const User = database?.userModel;
const Book = database?.bookModel;
const BookState = database?.bookStateModel;
const Author = database?.authorModel;


export const getAllDate = async ({ state, user_id, offset, limit, }) => {
    const response = await BookState.findAndCountAll({
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

export const getDateById = async (id) => {
    return Book.findByPk(id, {
        include: [
            { model: Author, attributes: ['name', 'image', 'genre', 'isVerify'], required: false, }
        ],
    });
};

export const getInfoFromBookState = async (book_id, user_id) => {
    return BookState.findOne({ where: { book_id, user_id, isDelete: false, }, attributes: ['book_state'], });
};

export const addingNewBookState = async ({ user_id, book_id, state, }) => {
    const existingBook = await BookState.findOne({ where: { book_id, user_id, isDelete: false, }, });
    if (existingBook) {
        existingBook.book_state = state;
        return await existingBook.save();
    }
    return await BookState.create({ user_id, book_id, book_state: state, });
};