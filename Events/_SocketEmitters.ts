import { Socket, } from 'socket.io';

import { ESendEvents, } from '../constants';

let io: Socket;

export const initEmitters = (socketIO) => {
    io = socketIO;
};

export const emitToSocketEvent = (eventName: ESendEvents, payload: unknown) => {
    if (io) {
        io.emit(eventName, payload);
    }
};

export const emitEventToSocket = (socketId: string, eventName: ESendEvents, payload: unknown) => {
    if (io) {
        io.to(socketId).emit(eventName, payload);
    }
};