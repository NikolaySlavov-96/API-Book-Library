import { hasUser, } from '../middleware';

import { search, auth, withUser, book, bookState, } from '../routes';

const PREFIX = '/api';

export default (app) => {
    app.use(`${PREFIX}}/auth`, auth);
    app.use(`${PREFIX}}/book`, book);
    app.use(`${PREFIX}/bookState`, bookState);
    app.use(`${PREFIX}}/users`, hasUser(), withUser);
    app.use(`${PREFIX}}/search`, search);
};