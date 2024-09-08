import db from '../Model';

const Op = db?.Sequelize?.Op;

const ATTRIBUTES = ['name', 'image', 'genre', 'isVerify'];

export const getBookByEmail = async (query) => {

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