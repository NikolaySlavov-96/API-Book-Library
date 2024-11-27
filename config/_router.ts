import { search, auth, product, } from '../routes';

const PREFIX = '';

export default (app) => {
    app.use(`${PREFIX}/auth`, auth);
    app.use(`${PREFIX}/product`, product);
    app.use(`${PREFIX}/search`, search);
};