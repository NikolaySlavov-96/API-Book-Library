import isEmpty from 'lodash/isEmpty';

import { EReceiveEvents, ESendEvents, } from '../constants';

import { storeVisitorInfo, } from '../services/visitorService';
import {
    changeUserStatus,
    createConnectionId,
    getAllConnectedSupports,
    joinUserToSupportChat,
    validateConnectionId,
} from '../services/supportMessageService';

interface ISupportChat {
    connectId?: string,
}

interface IMessageResponseJoinToChat {
    message
    : string,
    connectId
    : string

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

        socket.on(EReceiveEvents.SUPPORT_CHAT_USER_JOIN, async (data: ISupportChat) => {
            try {
                const messageResponseJoinToChat: IMessageResponseJoinToChat = {
                    message: WELCOME_USER_TEXT,
                    connectId: '',
                };

                const supports = await getAllConnectedSupports();

                if (data?.connectId) {
                    const result = await validateConnectionId(data);

                    await changeUserStatus(result.currentSocketId, 'active', socketId);

                    result?.connectId ?
                        messageResponseJoinToChat.connectId = data.connectId :
                        messageResponseJoinToChat.connectId = '';

                    if (result?.User?.role === 'support') {
                        messageResponseJoinToChat.message = WELCOME_ADMIN_TEXT;
                        await joinUserToSupportChat(result, socketId);
                    }
                }

                if (messageResponseJoinToChat.connectId === '') {
                    const newConnectionId = await createConnectionId({ socketId, });
                    if ('connectId' in newConnectionId) {
                        messageResponseJoinToChat.connectId = newConnectionId.connectId;
                    } else {
                        throw newConnectionId;
                    }
                }

                // To all the "supports" who have joined
                supports.forEach(support => {
                    io.to(support.currentSocketId).emit(ESendEvents.NOTIFY_ADMINS_OF_NEW_USER, socketId);
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
            await changeUserStatus(socketId, 'inactive');

            // At disconnect on user send event to everyone else 
            // socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)}} disconnected`);
        });
    });
};