const { Book } = require('../Model/BookModel');

const getAllDate = async (query) => {
    const result = await Book.findAll();
    return result;
}

const getDateById = async (id) => {
    const result = await Book.findOne({ where: { id: id } })
    return result;
}

const create = async (query, array) => {
    /*
    const isBook = await Book.findOne({ where: { email: email } });

    if (isBook) {
        throw new Error('Book is created befor');
    }
    const createEmail = await Book.create({ book, release_date: "2023-12-14", });

    return createEmail;
    */
    const result = await dbConnect.query(query, array);
    return result;
}

const update = async (query) => {
    const result = await dbConnect.query(query);
    return result
}


const remove = async (query, id) => {
    const result = await dbConnect.query(query, [id]);
    return result;
}


module.exports = {
    getAllDate,
    getDateById,
    create,
    update,
    remove,
}