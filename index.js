const express = require('express');

const db = require('./services/bookService');

start();

async function start() {
    const app = express();

    app.use(express.json());

    app.get('/books',db.getDate);
    app.get('/books/:id', db.getDateById);
    app.post('/books', db.createBook);
    app.put('/books/:id', db.updateBook);
    app.delete('/books/:id', db.deleteBook);

    app.listen(3000, () => console.log('Application works'))
}
