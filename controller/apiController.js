const apiService = require('../services/apiService');


const getAllDate = async (req, res) => {
    const query = 'SELECT (SELECT COUNT(*) FROM book) as count, (SELECT json_agg(t.*) FROM(SELECT * FROM book OFFSET 10 LIMIT 10) AS t) AS rows';

    try {
        const result = await apiService.getAllDate(query, res.body);
        const rows = result.rows[0]
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