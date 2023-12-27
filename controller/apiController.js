const apiService = require('../services/apiService');
const { errorParser } = require('../util/parser');

const querys = {
    'Select': {
        'universalbook': ({ userId, limit, offset, type }) => `SELECT (SELECT COUNT(*) FROM user_book_${type} WHERE user_id=${userId}) as count, (SELECT json_agg(t.*) FROM(SELECT u.email, b.author, b.booktitle, b.id FROM account AS u JOIN user_book_${type} AS ubp ON ubp.user_id = u.id JOIN book AS b ON ubp.book_id = b.id WHERE u.id = ${userId} AND ubp.isdelete = false OFFSET ${offset} LIMIT ${limit}) AS t) AS rows`,
        'un_purchase_read': ({ user_id, book_id, type }) => `SELECT * FROM user_book_${type} WHERE user_id = ${user_id} AND book_id = ${book_id}`,
    },
    'Insert': {
        'un_purchase_read': ({ type }) => `INSERT INTO user_book_${type} (user_id, book_id) VALUES ($1, $2) RETURNING *`
    },
    'Update': {
        'un_purchase_read': ({ user_id, book_id, condition, type }) => `UPDATE user_book_${type} SET isdelete = ${!condition} WHERE user_id = ${user_id} AND book_id = ${book_id} RETURNING *`,
    }
}


const getAllDate = async (req, res) => {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const skipSource = (page - 1) * limit;
    const type = req.params.type;
    let typesQuery = type;
    const search = `%${req?.query?.search}%`;

    if (type === 'purchase' || type === 'forpurchase' || type === 'reading' || type === 'forreading') {
        typesQuery = 'universalbook'
    }
    /*
        const values = {
            offset: skipSource,
            limit,
            type,
            userId: req?.user?.id,
            search,
        };
    */

    const data = {
        'book': { offset: skipSource, limit },
        'search': { offset: skipSource, limit },
    }
    try {
        // console.log(querys['Select'][typesQuery](values))
        const result = await apiService.getAllDate(data[typesQuery], 'Op.like', search);
        res.status(200).json(result);
    } catch (err) {
        console.log(err);
        const message = errorParser(err);
        res.status(401).json({ message })
    }
}

const getDateById = async (req, res) => {

    try {
        const id = parseInt(req.params.id);
        const result = await apiService.getDateById(id);
        res.status(200).json(result);
    } catch (err) {
        const message = errorParser(err);
        res.status(401).json({ message })
    }
}

const createBook = async (req, res) => {
    const type = req.params.type;
    const user_id = req.user.id;
    const { author, booktitle, book_id } = req.body;

    try {
        const result = await apiService.create({ author, booktitle, user_id, book_id, type });
        res.status(201).json(JSON.stringify(result, null, 4));
    } catch (err) {
        console.log(err);
        const message = errorParser(err);
        res.status(401).json({ message })
    }
}

const updateBook = async (req, res) => {
    // const query = 'UPDATE book SET author = $1, booktitle = $2 WHERE id = $3';
    const id = parseInt(req.params.id);
    const type = req.params.type;
    const { author, booktitle } = req.body;
    try {
        const result = await apiService.update({ author, booktitle, id });
        res.status(200).send(result);
    } catch (err) {
        console.log(err);
        const message = errorParser(err);
        res.status(401).json({ message })
    }
}

const deleteBook = async (req, res) => {
    const id = parseInt(req.params.id);

    try {
        await apiService.remove(id);
        res.status(204).end();
    } catch (err) {
        const message = errorParser(err);
        res.status(401).json({ message })
    }
}

module.exports = {
    getAllDate,
    getDateById,
    createBook,
    updateBook,
    deleteBook,
}