import { ESendEvents } from '../constants';
import { emitEventToPrincipal } from '../Events/_SocketEmitters';
import { type Principal } from '../services/principalService';
import { getAllOnlineSupports, getAllWaitingUsers } from '../services/support/supportManagerService';

export const notifySupportsOfNewUser = async (newUserPrincipal: Principal) => {
    const supports = await getAllOnlineSupports();
    const usersInQueue = await getAllWaitingUsers();

    supports.forEach((supportPrincipal) => {
        emitEventToPrincipal(supportPrincipal, ESendEvents.NOTIFY_ADMINS_OF_NEW_USER, {
            newUserPrincipal,
            userQueue: usersInQueue,
        });
    });
};
