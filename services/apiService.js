const { Book, Op } = require('../Model/BookModel');
const { BookState } = require('../Model/BookStateModel');

const getAllDate = async (query, type, search) => {
    const typeOfColletion = {
        'book': ({ offset, limit }) => Book.findAndCountAll({ offset, limit }),
        'search': ({ offset, limit }) => Book.findAndCountAll({ offset, limit }),
        'bookState': ({ offset, limit, type, user_id }) => BookState.findAndCountAll({ offset, limit, where: { book_state: type, user_id } }),
    }
    const typeOf = {
        'Op.like': Op.like,
    }

    type && (query.where = {
        [Op.or]: [{ booktitle: { [typeOf[type]]: search } }, { author: { [typeOf[type]]: search } }, { genre: { [typeOf[type]]: search } }],

    })
    return typeOfColletion[query.typesQuery](query);
}

const getDateById = async (id) => {
    return Book.findByPk(id)
}

const create = async (query) => {

    const type = query.type;
    let typeInput = query.type;
    if (type === 'purchase' || type === 'forpurchase' || type === 'reading' || type === 'forreading') {
        typeInput = 'bookState'
    }

    const typeOfColletion = {
        'verify': {
            'book': ({ booktitle }) => Book.findOne({ where: { booktitle } }),
            'bookState': ({ user_id, book_id }) => BookState.findOne({ where: { book_id, user_id, isDelete: false } }), // To Do adding and book_id
        },
        'create': {
            'book': ({ booktitle, author }) => Book.create({ booktitle, author }),
            'bookState': ({ user_id, book_id, type }) => BookState.create({ user_id, book_id, book_state: type }),
        }
    }

    const isBook = await typeOfColletion['verify'][typeInput](query)
    if (isBook && type === 'book') {
        throw new Error('Book is added before');
    }

    if (isBook && typeInput === 'bookState' && type !== 'book') {
        isBook.book_state = type;
        return await isBook.save();
    }

    const create = await typeOfColletion['create'][typeInput](query);
    return create;
}

const update = async ({ author, booktitle, id }) => {
    const data = await Book.findByPk(id)

    data.author = author;
    data.booktitle = booktitle;
    const result = await data.save();
    return result
}


const remove = async (id) => {
    const data = await Book.findByPk(id);
    return data.destroy();
}


module.exports = {
    getAllDate,
    getDateById,
    create,
    update,
    remove,
}