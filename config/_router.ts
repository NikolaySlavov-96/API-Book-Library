import { search, auth, product, file, } from '../routes';

const PREFIX = '';

export default (app) => {
    app.use(`${PREFIX}/auth`, auth);
    app.use(`${PREFIX}/product`, product);
    app.use(`${PREFIX}/file`, file);
    app.use(`${PREFIX}/search`, search);
};