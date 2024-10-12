import { isEmpty, } from 'lodash';

import { EReceiveEvents, ESendEvents, } from '../constants';

import { storeVisitorInfo, } from '../services/visitorService';
import {
    appendVisitorToList,
    assignRoleAndStatusToUser,
    createConnectionId,
    getAllConnectedSupports,
    getAllConnectedUsers,
    isUserInQueue,
    linkSocketIdToConnectionId,
    removeVisitorFromList,
    setStatus,
    validateConnectionId,
} from '../services/support/connectManagerService';
import {
    deleteRoom,
    initializeRoom,
    isRoomExist,
} from '../services/support/chatRoomService';

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
    io.on('connection', async (socket) => {
        const socketId = socket.id;

        console.log(`User ${socketId} connected`);
        await appendVisitorToList(socketId);

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

                    if (!result) {
                        console.log({ message: 'User Not fount', });
                        return;
                    }

                    messageResponseJoinToChat.connectId = result.connectId;
                    await linkSocketIdToConnectionId({
                        currentSocketId: socketId, connectId: result.connectId,
                    });

                    if (result.User.role === 'support') {
                        messageResponseJoinToChat.message = WELCOME_ADMIN_TEXT;
                        await assignRoleAndStatusToUser({
                            connectId: result.connectId, role: 'support', status: 'free',
                        });
                    } else {
                        // Add a user to the userQueue for managing chat requests or support sessions
                        await assignRoleAndStatusToUser({
                            connectId: result.connectId, role: 'user', status: 'waiting',
                        });
                    }
                }

                if (!data?.connectId) {
                    const newConnectionId = await createConnectionId({ socketId, });
                    if ('connectId' in newConnectionId) {
                        await linkSocketIdToConnectionId({
                            currentSocketId: socketId, connectId: newConnectionId.connectId,
                        });
                        messageResponseJoinToChat.connectId = newConnectionId.connectId;
                        await assignRoleAndStatusToUser({
                            connectId: newConnectionId.connectId, role: 'user', status: 'waiting',
                        });
                    } else {
                        throw newConnectionId;
                    }
                }

                // To all the "supports" who have joined
                const supports = await getAllConnectedSupports();
                const usersInQueue = await getAllConnectedUsers();
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

        socket.on(EReceiveEvents.SUPPORT_ACCEPT_USER, async (data: { supportId: string, acceptUserId: string }) => {
            try {
                const resultFromCheck = await validateConnectionId({ connectId: data.supportId, });
                if (resultFromCheck?.User?.role !== 'support') {
                    // Trigger an event when a user is not authorized to accept a support chat request
                    return;
                }

                const isUserExist = await isUserInQueue({ connectId: data.acceptUserId, });
                if (!isUserExist) {
                    // Trigger an event when the specified user is not found in the queue
                    return;
                }

                // Create a new chat room for users to join and interact within
                const roomInfo = await initializeRoom(resultFromCheck, isUserExist);
                socket.join(roomInfo.roomName);

                await setStatus({ connectId: data.supportId, }, 'busy');

                await setStatus({ connectId: data.acceptUserId, }, 'busy');

                // Automatically send a message to the user that includes the support agent's name
                const supportSocketId = resultFromCheck.currentSocketId;
                const userSocketId = isUserExist.currentSocketId;
                io.to(userSocketId).emit(ESendEvents.SEND_SUPPORT_MESSAGE, {
                    roomName: roomInfo.roomName, message: 'user',
                });
                io.to(supportSocketId).emit(ESendEvents.SEND_SUPPORT_MESSAGE, {
                    roomName: roomInfo.roomName, message: 'support',
                });

                // To all the "supports" who have joined
                const supports = await getAllConnectedSupports();
                const usersInQueue = await getAllConnectedUsers();
                supports.forEach(support => {
                    io.to(support.currentSocketId).emit(ESendEvents.NOTIFY_ADMINS_OF_NEW_USER,
                        {
                            newUserSocketId: socketId,
                            userQueue: usersInQueue,
                        }
                    );
                });
            } catch (err) {
                console.log('error: SUPPORT_ACCEPT_USER: ', err);
            }
        });

        socket.on(EReceiveEvents.SUPPORT_CHAT_USER_LEAVE, async (data: { roomName: string }) => {
            const resultFromRoom = await isRoomExist({ roomName: data?.roomName, });
            if (!resultFromRoom) {
                // room is not exist
                return;
            }

            socket.leave(resultFromRoom.roomName);

            await deleteRoom({ roomName: resultFromRoom.roomName, });

            // Update the status of the support agent to "free"
            await setStatus({ connectId: resultFromRoom.supportConnectId, }, 'free');
            // Update the status of the user to "active"
            await setStatus({ connectId: resultFromRoom.userConnectId, }, 'active');
        });

        // When user disconnects - to all others 
        socket.on('disconnect', async () => {
            console.log(`User ${socketId} disconnected`);

            await removeVisitorFromList(socketId);

            // At disconnect on user send event to everyone else 
            // socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)}} disconnected`);
        });
    });
};