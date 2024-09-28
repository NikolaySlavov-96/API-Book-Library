import { cors, auth, socketMiddleware, trimBody, } from '../middleware';

import { SYSTEM_FILE_DIRECTORY, } from '../constants';

const whitelist = ['http://localhost:8080']; // TO DO
const MAX_FILE_SIZE = 10000000;

export default (app, express, io, fileUpload) => {
    app.use(socketMiddleware(io));

    app.use(express.static(SYSTEM_FILE_DIRECTORY.PUBLIC));
    app.use(`/${SYSTEM_FILE_DIRECTORY.UPLOAD}`, express.static(SYSTEM_FILE_DIRECTORY.UPLOAD));
    app.use(cors(whitelist));

    app.use(fileUpload({
        limits: {
            fieldSize: MAX_FILE_SIZE,
        },
        abortOnLimit: true,
    }));

    app.use(express.json());

    app.use(trimBody());
    app.use(auth());
};