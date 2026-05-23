import { createAdapter } from '@socket.io/redis-adapter';
import express from 'express';
import fileUpload from 'express-fileupload';
import server from 'http';
import { Server as SocketIOServer } from 'socket.io';

import 'dotenv/config';

import { checkDatabaseIfItExist, expressConfig, mongoClient, redisClient, router } from './config';
import { initEmitters, socketEvents } from './Events';
import { globalErrorHandling } from './Helpers';
import db from './Model';

const { APP_PORT, SOCKET_ADDRESS, DB_FORCE_STATUS } = process.env;

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
        transports: ['websocket'],
    });

    io.adapter(createAdapter(pubClient, subClient));

    await checkDatabaseIfItExist();

    await db.sequelize.authenticate();

    const resetStatus = DB_FORCE_STATUS === 'true' ? true : false;
    await db.sequelize.sync({ force: resetStatus });

    expressConfig(app, express, fileUpload);

    router(app);

    initEmitters(io);
    socketEvents(io);

    app.use(globalErrorHandling());

    initServer.listen(APP_PORT, () => console.log('Application works on port ~: ', APP_PORT));
}

void start();
