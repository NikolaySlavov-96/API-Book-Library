import { MESSAGES, } from '../constants';

import { database, } from '../config';

import { updateMessage, } from '../util';

const Book = database?.bookModel;
const Author = database?.authorModel;

const ATTRIBUTES = ['name', 'image', 'genre', 'isVerify'];

export const getAllData = async ({ offset, limit, }) => {
    const getBooks = await Book.findAndCountAll({
        include: [{
            model: Author,
            required: false,
            attributes: ATTRIBUTES,
        }],
        order: [['id', 'ASC']],
        attributes: ['id', 'booktitle', 'image', 'genre', 'isVerify'],
        offset,
        limit,
    });

    return getBooks;
};

export const getDataById = async (id) => {
    return Book.findByPk(id, {
        include: [
            { model: Author, attributes: ATTRIBUTES, required: false, }
        ],
    });
};

export const create = async ({ author, booktitle, }) => {
    const existingBook = await Book.findOne({ where: { booktitle, }, });
    if (existingBook) {
        return updateMessage(MESSAGES.BOOK_ALREADY_EXIST);
    }

    if (!existingBook) {
        const isAuthor = await Author.findOne({ where: { name: author, }, });

        if (!isAuthor) {
            const createAuthor = await Author.create({ name: author, });
            author = createAuthor.dataValues.author_id;
        }
        isAuthor && (author = isAuthor.dataValues.author_id);
    }

    const create = await Book.create({ booktitle, author_id: author, });
    return create;
};

export const update = async ({ author, booktitle, id, }) => {
    const data = await Book.findByPk(id);

    // data.authorName = author; // To Do Adding editing author name
    data.booktitle = booktitle;
    const result = await data.save();
    return result;
};


export const remove = async (id) => {
    const data = await Book.findByPk(id);
    return data.destroy(); // To Do adding isDelete of True
};