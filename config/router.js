const auth = require('../routes/auth');
const book = require('../routes/book');
const withUser = require('../routes/withUser');

module.exports = (app) => {
    app.use('/auth', auth);
    app.use('/book', book);
    app.use('/users', withUser);
}