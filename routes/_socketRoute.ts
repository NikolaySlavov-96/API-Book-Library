import { isEmpty, } from 'lodash';

import { EReceiveEvents, ESendEvents, } from '../constants';

import { storeVisitorInfo, } from '../services/visitorService';
import {
    changeUserStatus,
    createConnectionId,
    getAllConnectedSupports,
    getQueuedUsers,
    joinUserToSupportChat,
    joinUserToUserQueue,
    validateConnectionId,
} from '../services/support/connectManagerService';

interface ISupportChat {
    connectId?: string,
}

interface IMessageResponseJoinToChat {
    message: string;
    connectId: string;
}

const WELCOME_USER_TEXT = 'Welcome to Support Chat!';
const WELCOME_ADMIN_TEXT = 'Welcome to Support Chat Admin!';
export default (io) => {
    io.on('connection', (socket) => {
        const socketId = socket.id;

        console.log(`User ${socketId} connected`);

        // Upon connection - to all others (Skip sender)
        // socket.broadcast.emit('message', `User ${socketId.substring(0, 5)}} connected`);

        socket.on(EReceiveEvents.USER_JOINED, async (data) => {
            if (!isEmpty(data)) {
                const count = await storeVisitorInfo(data);
                if (count.isNewUser) {
                    socket.broadcast.emit(ESendEvents.USER_JOINED, count);
                }
                socket.emit(ESendEvents.USER_JOINED, count);
            }
        });

        // Handle the event when a user opens a support chat session
        socket.on(EReceiveEvents.SUPPORT_CHAT_USER_JOIN, async (data: ISupportChat) => {
            try {
                const messageResponseJoinToChat: IMessageResponseJoinToChat = {
                    message: WELCOME_USER_TEXT,
                    connectId: '',
                };

                if (data?.connectId) {
                    const result = await validateConnectionId(data);

                    if (result.connectId) {
                        messageResponseJoinToChat.connectId = result.connectId;
                        await changeUserStatus({
                            socketId: result.currentSocketId,
                            userSessionId: result.id,
                            status: 'active',
                            newSocketId: socketId,
                        });
                    }

                    if (result?.User?.role === 'support') {
                        messageResponseJoinToChat.message = WELCOME_ADMIN_TEXT;
                        await joinUserToSupportChat(result, socketId);
                    } else {
                        // Add a user to the userQueue for managing chat requests or support sessions
                        await joinUserToUserQueue(data, socketId);
                    }
                }

                if (!data?.connectId) {
                    const newConnectionId = await createConnectionId({ socketId, });
                    if ('connectId' in newConnectionId) {
                        messageResponseJoinToChat.connectId = newConnectionId.connectId;
                        await joinUserToUserQueue({ connectId: newConnectionId.connectId, }, socketId);
                    } else {
                        throw newConnectionId;
                    }
                }

                // To all the "supports" who have joined
                const supports = await getAllConnectedSupports();
                const usersInQueue = await getQueuedUsers();
                supports.forEach(support => {
                    io.to(support.currentSocketId).emit(ESendEvents.NOTIFY_ADMINS_OF_NEW_USER,
                        {
                            newUserSocketId: socketId,
                            userQueue: usersInQueue,
                        }
                    );
                });

                // To user who joined 
                socket.emit(ESendEvents.SUPPORT_CHAT_USER_JOIN_ACKNOWLEDGMENT, messageResponseJoinToChat);
            } catch (err) {
                // socket.emit('error')
                console.log('SocketRoute @Support Chat', err);
            }
        });

        // When user disconnects - to all others 
        socket.on('disconnect', async () => {
            console.log(`User ${socketId} disconnected`);

            // Update user status on Offline
            await changeUserStatus({ socketId, status: 'inactive', });

            // At disconnect on user send event to everyone else 
            // socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)}} disconnected`);
        });
    });
};