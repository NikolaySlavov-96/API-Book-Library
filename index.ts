import 'dotenv/config';
import express from 'express';
import fileUpload from 'express-fileupload';
import server from 'http';
import { Server as SocketIOServer, } from 'socket.io';
import { createAdapter, } from '@socket.io/redis-adapter';

import {
    checkDatabaseIfItExist,
    expressConfig,
    router,
    mongoClient,
    redisClient,
} from './config';

import { globalErrorHandling, } from './Helpers';

import db from './Model';
import { initEmitters, socketEvents, } from './Events';

const { PORT, SOCKET_ADDRESS, } = process.env;

start();
const app = express();

const pubClient = redisClient;
const subClient = pubClient.duplicate();

async function start() {
    await mongoClient();

    await redisClient.connect();
    await subClient.connect();

    const initServer = server.createServer(app);
    const io = new SocketIOServer(initServer, {
        path: SOCKET_ADDRESS,
        cors: {
            origin: '*',
        },
    });

    io.adapter(createAdapter(pubClient, subClient));

    await checkDatabaseIfItExist();

    await db.sequelize.authenticate();

    await db.sequelize.sync({ force: false, });

    expressConfig(app, express, fileUpload);

    router(app);

    initEmitters(io);
    socketEvents(io);

    app.use(globalErrorHandling());

    initServer.listen(PORT, () => console.log('Application works on port ~: ', PORT));
}