const apiService = require('../services/apiService');

const querys = {
    'bookSelect': ({ offset, limit }) => `SELECT (SELECT COUNT(*) FROM book) as count, (SELECT json_agg(t.*) FROM(SELECT * FROM book OFFSET ${offset} LIMIT ${limit}) AS t) AS rows`,
    'universalbookSelect': ({ userId, limit, offset, type }) => `SELECT (SELECT COUNT(*) FROM user_book_${type}) as count, (SELECT json_agg(t.*) FROM(SELECT u.email, b.author, b.booktitle FROM account AS u JOIN user_book_${type} AS ubp ON ubp.user_id = u.id JOIN book AS b ON ubp.book_id = b.id WHERE u.id = ${userId} OFFSET ${offset} LIMIT ${limit}) AS t) AS rows`,
}


const getAllDate = async (req, res) => {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const skipSource = (page - 1) * limit;
    const type = req.params.type;
    let typesQuery = type;

    if (type === 'purchase' || type === 'forpurchase' || type === 'read') {
        typesQuery = 'universalbook'
    }

    const values = {
        offset: skipSource,
        limit,
        type,
        userId: req.user.id,
    };

    try {
        const result = await apiService.getAllDate(querys[typesQuery + 'Select'](values), res.body);
        const rows = result.rows[0];

        res.status(200).json({ rows: rows.rows, count: rows.count });
    } catch (err) {

    }
}

const getDateById = async (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'SELECT * FROM book WHERE id = $1';

    try {
        const result = await apiService.getDateById(query, id);
        res.status(200).json(result.rows);
    } catch (err) {

    }
}

const createBook = async (req, res) => {
    const query = 'INSERT INTO book (author, booktitle) VALUES ($1, $2) RETURNING *';

    try {
        const result = await apiService.create(query, req.body);
        res.status(201).json(result.rows[0]);
    } catch (err) {

    }
}

const updateBook = async (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'UPDATE book SET author = $1, booktitle = $2 WHERE id = $3';

    try {
        const result = await apiService.update(query, id, req.body);
        res.status(200).send(`Book modified with ID: ${id}`)
    } catch (err) {

    }
}


const deleteBook = async (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM book WHERE id = $1';

    try {
        const result = await apiService.remove(query, id);
        res.status(200).send(`Book delete with ID: ${id}`);
    } catch (err) {

    }
}

module.exports = {
    getAllDate,
    getDateById,
    createBook,
    updateBook,
    deleteBook,
}