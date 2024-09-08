import { cors, auth, socketMiddleware, trimBody, } from '../middleware';

const whitelist = ['http://localhost:8080'];

export default (app, express, io) => {
    app.use(socketMiddleware(io));

    app.use(express.static('public'));
    app.use(cors(whitelist));
    app.use(express.json());

    app.use(trimBody());
    app.use(auth());
};