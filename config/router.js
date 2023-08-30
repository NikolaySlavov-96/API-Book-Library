const auth = require('../routes/auth');
const book = require('../routes/book');

module.exports = (app) => {
    app.use('/auth', auth);
    app.use('/book', book);
}