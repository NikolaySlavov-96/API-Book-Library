import 'dotenv/config';
import express from 'express';
import fileUpload from 'express-fileupload';
import server from 'http';
import { Server as SocketIOServer, } from 'socket.io';

import {
    checkDatabaseIfItExist,
    expressConfig,
    router,
    mongoClient,
    redisClient,
} from './config';

import { globalErrorHandling, } from './Helpers';

import db from './Model';
import { initEmitters, SocketEvents, } from './Events';

const { PORT, } = process.env;

start();
const app = express();
const initServer = server.createServer(app);
const io = new SocketIOServer(initServer, {
    path: '/bookHub',
    cors: {
        origin: '*',
    },
});

async function start() {
    await mongoClient();

    await redisClient.connect();

    await checkDatabaseIfItExist();

    await db.sequelize.authenticate();

    await db.sequelize.sync({ force: false, });

    expressConfig(app, express, io, fileUpload);

    router(app);

    initEmitters(io);
    SocketEvents(io);

    app.use(globalErrorHandling());

    initServer.listen(PORT, () => console.log('Application works'));
}