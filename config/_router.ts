import { hasUser, } from '../middleware';

import { search, auth, book, bookState, } from '../routes';

const PREFIX = '/api';

export default (app) => {
    app.use(`${PREFIX}}/auth`, auth);
    app.use(`${PREFIX}}/book`, book);
    app.use(`${PREFIX}/bookState`, hasUser(), bookState);
    app.use(`${PREFIX}}/search`, search);
};