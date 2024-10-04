import { cors, auth, socketMiddleware, trimBody, checkClientIP, } from '../middleware';

import { SYSTEM_FILE_DIRECTORY, } from '../constants';

const { FILE_SIZE, } = process.env;

export default (app, express, io, fileUpload) => {
    app.use(socketMiddleware(io));

    app.use(checkClientIP());

    app.use(express.static(SYSTEM_FILE_DIRECTORY.PUBLIC));
    app.use(`/${SYSTEM_FILE_DIRECTORY.UPLOAD}`, express.static(SYSTEM_FILE_DIRECTORY.UPLOAD));
    app.use(cors(''));

    app.use(fileUpload({
        limits: {
            fieldSize: FILE_SIZE,
        },
        abortOnLimit: true,
    }));

    app.use(express.json());

    app.use(trimBody());
    app.use(auth());
};