import { search, auth, withUser, book, } from '../routes';

export default (app) => {
    app.use('/auth', auth);
    app.use('/book', book);
    app.use('/users', withUser);
    app.use('/search', search);

    app.use((error, req, res, next) => {
        console.log('Global Error - ', error);

        res.status(error.status || 500);
        res.json({
            userInfo: {},
            message: error.status ? error : 'Something whent wrong!',
        });
    });
};