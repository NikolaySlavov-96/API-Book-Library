import { EReceiveEvents, ESendEvents, } from '../constants';

import { storeVisitorInfo, } from '../services/visitorService';

export default (io) => {
    io.on('connection', (socket) => {
        console.log(`User ${socket.id} connected`);

        socket.on(EReceiveEvents.USER_JOINED, async (data) => {
            const count = await storeVisitorInfo(data);
            if (count.isNewUser) {
                socket.broadcast.emit(ESendEvents.USER_JOINED, count);
            }
            socket.emit(ESendEvents.USER_JOINED, count);
        });
    });
};