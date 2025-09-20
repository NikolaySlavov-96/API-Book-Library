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
            as: 'authors',
            attributes: ATTRIBUTES,
            // where: searchContent ? {
            //     name: { [queryOperator]: searchContent, },
            // } : {},
        },
        {
            model: db.File,
            required: false,
            as: 'files',
            attributes: ['id', 'src', 'uniqueName'],
        }
        ],
        order: [['id', 'ASC']],
        attributes: ['id', 'productTitle', 'genre', 'isVerify'],
        offset,
        limit,
        distinct: true,
        where: {},
    };


    !!searchContent && (query.where = {
        [Op.or]: [
            {
                productTitle: { [queryOperator]: searchContent, },
            },
            {
                genre: { [queryOperator]: searchContent, },
            }
        ],
    });

    const result = await db.Product.findAndCountAll(query);

    const mappedResponse = responseMapper(result, EMappedType.PRODUCT);

    return mappedResponse;
};

export const getDataById = async (id: number) => {
    const result = await db.Product.findByPk(id, {
        include: [
            {
                model: db.Author,
                as: 'authors',
                attributes: ATTRIBUTES,
                required: false,
            },
            {
                model: db.File,
                required: false,
                as: 'files',
                attributes: ['id', 'src', 'uniqueName'],
            }
        ],
    });

    const mappedResponse = mappedSingleObject(result, EMappedType.PRODUCT);

    return mappedResponse;
};

const checkAndInsertAuthors = async (authors: string): Promise<number[]> => {
    const authorsIds = [];
    const authorsName = authors.split('<->');

    for (const authorName of authorsName) {
        const _authorName = authorName.trim();

        const isAuthor = (await db.Author.findOne({ where: { name: _authorName, }, }))?.dataValues;
        if (!isAuthor) {
            const author = (await db.Author.create({ name: _authorName, }))?.dataValues;
            authorsIds.push(author.id);
            continue;
        }
        authorsIds.push(isAuthor.id);
    }
    return authorsIds;
};

const insertProductAuthors = async (productId: number, authorsId: number[]): Promise<void> => {
    for (const authorId of authorsId) {
        await db.ProductAuthor.create({
            productId,
            authorId,
        });
    }
};

const insertProductFiles = async (productId: number, filesId: number[]): Promise<void> => {
    for (const fileId of filesId) {
        await db.ProductFile.create({
            productId,
            fileId,
        });
    }
};


export const create = async ({ author, productTitle, genre, filesId, }) => {
    const modTitle = productTitle.trim();
    const modGenre = genre.trim();

    const existingProduct = (await db.Product.findOne({
        where: {
            productTitle: { [Op.iLike]: modTitle, },
        },
    }))?.dataValues;

    if (existingProduct) {
        return updateMessage(MESSAGES.PRODUCT_ALREADY_EXIST, 403);
    }

    const authorsId = await checkAndInsertAuthors(author);

    const create = (await db.Product.create({ productTitle: modTitle, genre: modGenre, }))?.dataValues;

    if (filesId?.length) {
        await insertProductFiles(create.id, filesId);
    }

    await insertProductAuthors(create.id, authorsId);

    return create;
};

export const update = async (id, { author, productTitle, }) => {
    const data: any = [] //await Book.findByPk(id);

    // data.authorName = author; // To Do Adding editing author name
    data.productTitle = productTitle;
    const result = await data.save();
    return result;
};


export const remove = async (id) => {
    const data = []// await Book.findByPk(id);
    return data;
    // return data.destroy(); // To Do adding isDelete of True
};
