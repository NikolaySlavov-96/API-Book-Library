import { type Socket } from 'socket.io';

import { type ESendEvents } from '../constants';
import { type Principal, principalRoom } from '../services/principalService';

let io: Socket;

export const initEmitters = (socketIO) => {
    io = socketIO;
};

export const emitToSocketEvent = (eventName: ESendEvents, payload: unknown) => {
    if (io) {
        io.emit(eventName, payload);
    }
};

export const emitEventToPrincipal = (principal: Principal, eventName: ESendEvents, payload: unknown) => {
    if (io) {
        io.to(principalRoom(principal)).emit(eventName, payload);
    }
};
