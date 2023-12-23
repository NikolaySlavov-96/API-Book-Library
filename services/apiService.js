const { Book, Op } = require('../Model/BookModel');

const getAllDate = async (query, type, search) => {

    const typeOf = {
        'Op.like': Op.like,
    }

    type && (query.where = {
        [Op.or]: [{ booktitle: { [typeOf[type]]: search } }, { author: { [typeOf[type]]: search } }, { genre: { [typeOf[type]]: search } }]
    })
    // return Book.findAll({});
    return Book.findAndCountAll(query);
}

const getDateById = async (id) => {
    return Book.findByPk(id)
}

const create = async (query) => {
    /*
    const isBook = await Book.findOne({ where: { email: email } });

    if (isBook) {
        throw new Error('Book is created befor');
    }
    */
    const createEmail = await Book.create(query);

    return createEmail;
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