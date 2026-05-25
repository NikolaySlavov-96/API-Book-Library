import { createAdapter } from '@socket.io/redis-adapter';
import express from 'express';
import fileUpload from 'express-fileupload';
import server from 'http';
import { Server as SocketIOServer } from 'socket.io';

import 'dotenv/config';

import { expressConfig, mongoClient, redisClient, router } from './config';
import { ensureDatabaseExists, verifyDatabaseConnections } from './db';
import { initEmitters, socketEvents } from './Events';
import { globalErrorHandling } from './Helpers';

const { APP_PORT, SOCKET_ADDRESS } = process.env;

const app = express();

const pubClient = redisClient;
const subClient = pubClient.duplicate();

async function start() {
    await mongoClient();

    await redisClient.connect();
    await subClient.connect();

    const initServer = server.createServer(app);

    const allowedOrigins = (process.env.CORS_ORIGIN ?? process.env.WEB_URI ?? '')
        .split(',')
        .map((o) => o.trim())
        .filter(Boolean);

    const io = new SocketIOServer(initServer, {
        path: SOCKET_ADDRESS,
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                return callback(new Error('Origin not allowed by CORS'));
            },
            credentials: true,
        },
        transports: ['websocket'],
    });

    io.adapter(createAdapter(pubClient, subClient));

    await ensureDatabaseExists();
    await verifyDatabaseConnections();

    expressConfig(app, express, fileUpload);

    router(app);

    initEmitters(io);
    socketEvents(io);

    app.use(globalErrorHandling());

    initServer.listen(APP_PORT, () => console.log('Application works on port ~: ', APP_PORT));
}

void start();
