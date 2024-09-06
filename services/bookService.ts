import { MESSAGES, } from '../constants';

import db from '../Model';

import { updateMessage, } from '../util';

const ATTRIBUTES = ['name', 'image', 'genre', 'isVerify'];

export const getAllData = async ({ offset, limit, }) => {
    const getBooks = await db.Book.findAndCountAll({
        include: [{
            model: db.Author,
            required: false,
            attributes: ATTRIBUTES,
        }],
        order: [['id', 'ASC']],
        attributes: ['id', 'bookTitle', 'image', 'genre', 'isVerify'],
        offset,
        limit,
    });

    return getBooks;
};

export const getDataById = async (id) => {
    return db.Book.findByPk(id, {
        include: [
            {
                model: db.Author,
                attributes: ATTRIBUTES,
                required: false
            },
        ],
    });
};

export const create = async ({ author, bookTitle, }) => {
    const existingBook = (await db.Book.findOne({ where: { bookTitle, }, }))?.dataValues;
    if (existingBook) {
        return updateMessage(MESSAGES.BOOK_ALREADY_EXIST);
    }

    if (!existingBook) {
        const isAuthor = (await db.Author.findOne({ where: { name: author, }, }))?.dataValues;

        if (!isAuthor) {
            const createAuthor = (await db.Author.create({ name: author, }))?.dataValues;
            author = createAuthor.id;
        }
        isAuthor && (author = isAuthor.id);
    }

    const create = (await db.Book.create({ bookTitle, authorId: author, }))?.dataValues;
    return create;
};

export const update = async ({ author, booktitle, id, }) => {
    const data: any = [] //await Book.findByPk(id);

    // data.authorName = author; // To Do Adding editing author name
    data.bookTitle = booktitle;
    const result = await data.save();
    return result;
};


export const remove = async (id) => {
    const data = []// await Book.findByPk(id);
    return data
    // return data.destroy(); // To Do adding isDelete of True
};