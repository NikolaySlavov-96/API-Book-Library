const { dbConnect } = require("../config/database");

const getDate = (req, res) => {
    dbConnect.query('SELECT * FROM book ORDER BY id ASC', (err, result) => {
        if (err) { throw err }

        res.status(200).json(result.rows);
    })
}

const getDateById = (req, res) => {
    const id = parseInt(req.params.id);

    dbConnect.query('SELECT * FROM book WHERE id = $1', [id], (err, result) => {
        if (err) { throw err }

        res.status(200).json(result.rows);
    });
}

const createBook = (req, res) => {
    const { author, booktitle } = req.body;

    dbConnect.query('INSERT INTO book (author, booktitle) VALUES ($1, $2) RETURNING *', [author, booktitle,], (err, result) => {
        if (err) { throw err }

        res.status(201).json(result.rows[0]);
        // res.status(201).send(`Book added with ID: ${result.rows[0].id}`)
    })
}

const updateBook = (req, res) => {
    const id = parseInt(req.params.id);
    const { author, booktitle } = req.body;

    dbConnect.query('UPDATE book SET author = $1, booktitle = $2 WHERE id = $3', [author, booktitle, id], (err, result) => {
        if (err) { throw err }

        // res.status(200).json(result.rows);
        res.status(200).send(`Book modified with ID: ${id}`)
    })
}


const deleteBook = (req, res) => {
    const id = parseInt(req.params.id);

    dbConnect.query('DELETE FROM book WHERE id = $1', [id], (err, result) => {
        if (err) { throw err };

        res.status(200).send(`Book delete with ID: ${id}`);
    })
}


module.exports = {
    getDate,
    getDateById,
    createBook,
    updateBook,
    deleteBook,
}