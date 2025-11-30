import { ESendEvents, } from '../constants';

import { emitEventToSocket, } from '../Events/_SocketEmitters';

import { getAllOnlineSupports, getAllWaitingUsers, } from '../services/support/supportManagerService';
import { normalizeInputData } from '../util';

export const notifySupportsOfNewUser = async (connectId: string) => {
    const supports = await getAllOnlineSupports();
    const usersInQueue = await getAllWaitingUsers();

    supports.forEach((support) => {
        const payload = {
            newUserSocketId: connectId,
            userQueue: usersInQueue,
        };
        const dataString = normalizeInputData(support);
        emitEventToSocket(dataString, ESendEvents.NOTIFY_ADMINS_OF_NEW_USER, payload);
    });
};