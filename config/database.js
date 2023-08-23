const db = require('pg').Pool;

const dbConnect = new db({
    user: 'postgres',
    host: '192.168.88.51',
    database: 'book',
    password: '5566',
    port: '5433'
});

const getDate = (req, res) => {
    dbConnect.query('SELECT * FROM titles ORDER BY id ASC', (err, result) => {
        if (err) { throw err }

        res.status(200).json(result.rows);
    })
}

const getDateById = (req, res) => {
    const id = parseInt(req.params.id);

    dbConnect.query('SELECT * FROM titles WHERE id = $1', [id], (err, result) => {
        if (err) { throw err }

        res.status(200).json(result.rows);
    });
}

const createBook = (req, res) => {
    const { name } = req.body;

    dbConnect.query('INSERT INTO titles (name) VALUES ($1) RETURNING *', [name], (err, result) => {
        if (err) { throw err }

        res.status(201).json(result.rows[0]);
        // res.status(201).send(`Book added with ID: ${result.rows[0].id}`)
    })
}

const updateBook = (req, res) => {
    const id = parseInt(req.params.id);
    const { name } = req.body;

    dbConnect.query('UPDATE titles SET name = $1 WHERE id = $2', [name, id], (err, result) => {
        if (err) { throw err }

        // res.status(200).json(result.rows);
        res.status(200).send(`Book modified with ID: ${id}`)
    })
}


const deleteBook = (req, res) => {
    const id = parseInt(req.params.id);

    dbConnect.query('DELETE FROM titles WHERE id = $1', [id], (err, result) => {
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