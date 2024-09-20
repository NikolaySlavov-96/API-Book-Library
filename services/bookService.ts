import { MESSAGES, } from '../constants';
import { responseMapper, EMappedType, } from '../Helpers';

import db from '../Model';
const Op = db?.Sequelize?.Op;

import { updateMessage, } from '../util';

const ATTRIBUTES = ['name', 'image', 'genre', 'isVerify'];

export const getAllData = async ({ offset, limit, filterOperator, searchContent, }) => {
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
        raw: true,
        nest: true,
        where: {},
    };

    const queryOperator = Op[filterOperator];

    !!searchContent && (query.where = {
        [Op.or]: [
            {
                bookTitle: { [queryOperator]: searchContent, },
            },
            {
                genre: { [queryOperator]: searchContent, },
            },
            {
                '$Author.name$': { [queryOperator]: searchContent, },
            }
        ],
    });

    const result = await db.Book.findAndCountAll(query);

    const mappedResponse = responseMapper(result, EMappedType.BOOK);

    return mappedResponse;
};

export const getDataById = async (id) => {
    return db.Book.findByPk(id, {
        include: [
            {
                model: db.Author,
                attributes: ATTRIBUTES,
                required: false,
            }
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