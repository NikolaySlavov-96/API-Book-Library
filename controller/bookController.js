const bookService = require('../services/bookService');

const getAllDate = async (req, res) => {
    const query = 'SELECT * FROM book ORDER BY id ASC';

    try {
        const result = await bookService.getAllDate(query, res.body);
        res.status(200).json({ rows: result.rows, count: result.rowCount });
        // res.status(200).json(result.rows);
    } catch (err) {

    }
}

const getDateById = async (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'SELECT * FROM book WHERE id = $1';

    try {
        const result = await bookService.getDateById(query, id);
        res.status(200).json(result.rows);
    } catch (err) {

    }
}

const createBook = async (req, res) => {
    const query = 'INSERT INTO book (author, booktitle) VALUES ($1, $2) RETURNING *';

    try {
        const result = await bookService.create(query, req.body);
        res.status(201).json(result.rows[0]);
    } catch (err) {

    }
}

const updateBook = async (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'UPDATE book SET author = $1, booktitle = $2 WHERE id = $3';

    try {
        const result = await bookService.update(query, id, req.body);
        res.status(200).send(`Book modified with ID: ${id}`)
    } catch (err) {

    }
}


const deleteBook = async (req, res) => {
    const id = parseInt(req.params.id);
    const query = 'DELETE FROM book WHERE id = $1';

    try {
        const result = await bookService.remove(query, id);
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