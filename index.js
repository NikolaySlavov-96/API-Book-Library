const express = require('express');

const bookController = require('./controller/bookController');

start();

async function start() {
    const app = express();

    app.use(express.json());

    app.get('/books', bookController.getAllDate);
    app.get('/books/:id', bookController.getDateById);
    app.post('/books', bookController.createBook);
    app.put('/books/:id', bookController.updateBook);
    app.delete('/books/:id', bookController.deleteBook);

    app.listen(3000, () => console.log('Application works'))
}
