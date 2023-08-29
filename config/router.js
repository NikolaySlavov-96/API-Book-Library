const book = require('../routes/book');

module.exports = (app) => {
    // app.use('/auth', );
    app.use('/book', book);
}