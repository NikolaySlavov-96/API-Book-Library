import { ESendEvents, } from '../constants';

import { emitEventToSocket, } from '../Events/_SocketEmitters';

import { getAllOnlineSupports, getAllWaitingUsers, } from '../services/support/supportManagerService';

export const notifySupportsOfNewUser = async (connectId: string) => {
    const supports = await getAllOnlineSupports();
    const usersInQueue = await getAllWaitingUsers();

    supports.forEach((support) => {
        const payload = {
            newUserSocketId: connectId,
            userQueue: usersInQueue,
        };
        emitEventToSocket(support, ESendEvents.NOTIFY_ADMINS_OF_NEW_USER, payload);
    });
};