import { search, auth, book, } from '../routes';

const PREFIX = '';

export default (app) => {
    app.use(`${PREFIX}/auth`, auth);
    app.use(`${PREFIX}/book`, book);
    app.use(`${PREFIX}/search`, search);
};