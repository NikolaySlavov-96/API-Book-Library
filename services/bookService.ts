import { MESSAGES, } from '../constants';
import { responseMapper, EMappedType, mappedSingleObject, } from '../Helpers';

import db from '../Model';
const Op = db?.Sequelize?.Op;

import { updateMessage, } from '../util';

const ATTRIBUTES = ['name', 'image', 'genre', 'isVerify'];

export const getAllData = async ({ offset, limit, filterOperator, searchContent, }) => {
    const queryOperator = Op[filterOperator];

    const query = {
        include: [{
            model: db.Author,
            required: false,
            attributes: ATTRIBUTES,
            // where: searchContent ? {
            //     name: { [queryOperator]: searchContent, },
            // } : {},
        },
        {
            model: db.File,
            attributes: ['id', 'src', 'uniqueName'],
        }],
        order: [['id', 'ASC']],
        attributes: ['id', 'bookTitle', 'genre', 'isVerify'],
        offset,
        limit,
        raw: true,
        nest: true,
        where: {},
    };


    !!searchContent && (query.where = {
        [Op.or]: [
            {
                bookTitle: { [queryOperator]: searchContent, },
            },
            {
                genre: { [queryOperator]: searchContent, },
            }
        ],
    });

    const result = await db.Book.findAndCountAll(query);

    const mappedResponse = responseMapper(result, EMappedType.PRODUCT);

    return mappedResponse;
};

export const getDataById = async (id) => {
    const result = await db.Book.findByPk(id, {
        include: [
            {
                model: db.Author,
                attributes: ATTRIBUTES,
                required: false,
            },
            {
                model: db.File,
                required: false,
                attributes: ['id', 'src', 'uniqueName'],
            }
        ],
        raw: true,
        nest: true,
    });

    const mappedResponse = mappedSingleObject(result, EMappedType.PRODUCT);

    return mappedResponse;
};

export const create = async ({ author, bookTitle, genre, }) => {
    const existingBook = (await db.Book.findOne({ where: { bookTitle, }, }))?.dataValues;
    if (existingBook) {
        return updateMessage(MESSAGES.BOOK_ALREADY_EXIST, 403);
    }

    if (!existingBook) {
        const isAuthor = (await db.Author.findOne({ where: { name: author, }, }))?.dataValues;

        if (!isAuthor) {
            const createAuthor = (await db.Author.create({ name: author, }))?.dataValues;
            author = createAuthor.id;
        }
        isAuthor && (author = isAuthor.id);
    }

    const create = (await db.Book.create({ bookTitle, authorId: author, genre, }))?.dataValues;
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