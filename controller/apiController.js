const apiService = require('../services/apiService');

const querys = {
    'Select': {
        'book': ({ offset, limit }) => `SELECT (SELECT COUNT(*) FROM book) as count, (SELECT json_agg(t.*) FROM(SELECT * FROM book OFFSET ${offset} LIMIT ${limit}) AS t) AS rows`,
        'universalbook': ({ userId, limit, offset, type }) => `SELECT (SELECT COUNT(*) FROM user_book_${type}) as count, (SELECT json_agg(t.*) FROM(SELECT u.email, b.author, b.booktitle FROM account AS u JOIN user_book_${type} AS ubp ON ubp.user_id = u.id JOIN book AS b ON ubp.book_id = b.id WHERE u.id = ${userId} AND ubp.isdelete = false OFFSET ${offset} LIMIT ${limit}) AS t) AS rows`,
        'search': ({ offset, limit, search }) => `SELECT (SELECT COUNT(*) FROM book WHERE booktitle LIKE '%${search}%' OR author LIKE '%${search}%' OR genre LIKE '%${search}%') as count, (SELECT json_agg(t.*) FROM(SELECT * FROM book WHERE booktitle LIKE '%${search}%' OR author LIKE '%${search}%' OR genre LIKE '%${search}%' OFFSET ${offset} LIMIT ${limit}) AS t) AS rows`,
        'bookid': ({ id }) => `SELECT * FROM book WHERE id = ${id}`,
        'forpurchase': ({ user_id, book_id }) => `SELECT * FROM user_book_forpurchase WHERE user_id = ${user_id} AND book_id = ${book_id}`,
    },
    'Insert': {
        'book': () => `INSERT INTO book (author, booktitle) VALUES ($1, $2) RETURNING *`,
        'forpurchase': () => `INSERT INTO user_book_forpurchase (user_id, book_id) VALUES ($1, $2) RETURNING *`
    },
    'Update': {
        'book': ({ author, booktitle, id }) => `UPDATE book SET author = ${author}, booktitle = ${booktitle} WHERE id = ${id} RETURNING *`,
        'forpurchase': ({ user_id, book_id, condition }) => `UPDATE user_book_forpurchase SET isdelete = ${!condition} WHERE user_id = ${user_id} AND book_id = ${book_id} RETURNING *`,
    }
}


const getAllDate = async (req, res) => {
    const page = parseInt(req?.query?.page) || 1;
    const limit = parseInt(req?.query?.limit) || 10;
    const skipSource = (page - 1) * limit;
    const type = req.params.type;
    let typesQuery = type;
    const search = req?.query?.search;

    if (type === 'purchase' || type === 'forpurchase' || type === 'reading') {
        typesQuery = 'universalbook'
    }

    const values = {
        offset: skipSource,
        limit,
        type,
        userId: req.user.id,
        search,
    };

    try {
        const result = await apiService.getAllDate(querys['Select'][typesQuery](values));
        const rows = result.rows[0];

        res.status(200).json({ rows: rows.rows, count: rows.count });
    } catch (err) {

    }
}

const getDateById = async (req, res) => {
    const id = parseInt(req.params.id);
    // const query = 'SELECT * FROM book WHERE id = $1';

    try {
        const result = await apiService.getDateById(querys['Select']['bookid']({ id }));
        res.status(200).json(result.rows);
    } catch (err) {

    }
}

const createBook = async (req, res) => {
    const type = req.params.type;
    const user_id = req.user.id;
    const { author, booktitle, book_id } = req.body;

    const array = {
        'book': [author, booktitle],
    }

    try {
        const verify = type !== 'book' && await apiService.getDateById(querys['Select'][type]({ user_id, book_id }));
        if (verify?.rows?.length) {
            const condition = verify.rows[0].isdelete;
            const resulst = await apiService.update(querys['Update'][type]({ user_id, book_id, condition }));
            res.status(201).json(resulst.rows[0]);
        }

        const result = await apiService.create(querys['Insert'][type](), array[type]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.log(err);
    }
}

const updateBook = async (req, res) => {
    // const query = 'UPDATE book SET author = $1, booktitle = $2 WHERE id = $3';
    const id = parseInt(req.params.id);
    const type = req.params.type;
    const { author, booktitle } = req.body;
    try {
        const result = await apiService.update(querys['Update'][type]({ author, booktitle, id }));
        res.status(200).send(result.rows[0]);
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