import { search, auth, withUser, book, } from '../routes';

const PREFIX = '/api';

export default (app) => {
    app.use(`${PREFIX}}/auth`, auth);
    app.use(`${PREFIX}}/book`, book);
    app.use(`${PREFIX}}/users`, withUser);
    app.use(`${PREFIX}}/search`, search);
};