import { isEmpty, isString, isUndefined, } from 'lodash';

import { EReceiveEvents, ESendEvents, } from '../constants';

import { storeVisitorInfo, } from '../services/visitorService';
import {
    registerNewVisitor,
    renewConnection,
    setUserInactive,
    validateConnectionId,
} from '../services/connectManagerService';
import {
    assignSupport,
    assignUserToQueue,
    getAllOnlineSupports,
    getAllWaitingUsers,
    isUserInQueue,
    unassignSupport,
    unassignUserFromQueue,
} from '../services/support/supportManagerService';
import {
    deleteRoom,
    initializeRoom,
    isRoomExist,
} from '../services/support/chatRoomService';
import { emitEventToSocket, } from './_SocketEmitters';

interface IMessageResponseJoinToChat {
    message: string;
}

const WELCOME_USER_TEXT = 'Welcome to Support Chat!';
const WELCOME_ADMIN_TEXT = 'Welcome to Support Chat Admin!';

const _socketEvents = (io) => {
    io.on('connection', async (socket) => {
        const connectId = socket.id;

        console.log(`User ${connectId} connected`);
        // Upon connection - to all others (Skip sender)
        // socket.broadcast.emit('message', `User ${connectId.substring(0, 5)}} connected`);

        socket.on(EReceiveEvents.USER_CONNECT, async (data) => {
            try {
                if (isUndefined(data) || !isString(data.unId) || data.unId === '') {
                    const result = await registerNewVisitor(connectId);
                    socket.emit(ESendEvents.USER_CONNECT_ACKNOWLEDGMENT, { unId: result?.dataValues?.unId, });
                    return;
                }

                await renewConnection(data, connectId);
            } catch (err) {
                console.log('SocketRoute Event ∞ USER_CONNECT', err);
            }
        });

        socket.on(EReceiveEvents.USER_JOINED, async (data) => {
            if (!isEmpty(data)) {
                const count = await storeVisitorInfo(data);
                if (count.isNewUser) {
                    socket.broadcast.emit(ESendEvents.USER_JOINED, count);
                }
                socket.emit(ESendEvents.USER_JOINED, count);
            }
        });

        socket.on(EReceiveEvents.SUPPORT_CHAT_USER_JOIN, async (data: { connectId: string, }) => {
            try {
                if (isUndefined(data) || !isString(data.connectId)) {
                    console.log('SUPPORT_CHAT_USER_JOIN ~ Incorrect Data');
                    return;
                }

                const messageResponseJoinToChat: IMessageResponseJoinToChat = {
                    message: WELCOME_USER_TEXT,
                };

                const result = await validateConnectionId(data);
                if (!result) {
                    console.log({ message: 'SUPPORT_CHAT_USER_JOIN ~ User Not fount', });
                    // throw { message: 'User Not fount', };
                    return;
                }

                if (result.User.role === 'support') {
                    await assignSupport(result.connectId);
                    messageResponseJoinToChat.message = WELCOME_ADMIN_TEXT;
                } else {
                    await assignUserToQueue({
                        connectId: result.connectId, name: 'Test Ivan',
                    });
                }


                // To all the "supports" who have joined
                const supports = await getAllOnlineSupports();
                const usersInQueue = await getAllWaitingUsers();
                supports.forEach((support) => {
                    const payload = {
                        newUserSocketId: connectId,
                        userQueue: usersInQueue,
                    };
                    emitEventToSocket(support, ESendEvents.NOTIFY_ADMINS_OF_NEW_USER, payload);
                });

                // To user who joined 
                socket.emit(ESendEvents.SUPPORT_CHAT_USER_JOIN_ACKNOWLEDGMENT, messageResponseJoinToChat);
            } catch (err) {
                // socket.emit('error')
                console.log('SocketRoute Event ∞ SUPPORT_CHAT_USER_JOIN', err);
            }
        });

        socket.on(EReceiveEvents.SUPPORT_ACCEPT_USER, async (data: { supportId: string, acceptUserId: string }) => {
            try {
                const resultFromSupportCheck = await validateConnectionId({ connectId: data.supportId, });
                if (resultFromSupportCheck?.User?.role !== 'support') {
                    // Trigger an event when a user is not authorized to accept a support chat request
                    console.log('SUPPORT_ACCEPT_USER ~ Not support');
                    return;
                }

                const resultFromUserCheck = await isUserInQueue({ connectId: data.acceptUserId, });
                if (!resultFromUserCheck) {
                    console.log('SUPPORT_ACCEPT_USER ~ User doesn\'t exist');
                    // Trigger an event when the specified user is not found in the queue
                    return;
                }

                const roomInfo = await initializeRoom(resultFromSupportCheck, resultFromUserCheck);
                socket.join(roomInfo.roomName);

                await unassignUserFromQueue(resultFromUserCheck.connectId);


                // Automatically send a message to the user that includes the support agent's name
                const modifySupportData = resultFromSupportCheck.User.email.split('@')[0];
                const userPayload = {
                    roomName: roomInfo.roomName,
                    message: `Support with name ${modifySupportData} is accepted your request`,
                };
                const supportPayload = {
                    roomName: roomInfo.roomName, message: 'support',
                };
                emitEventToSocket(resultFromUserCheck.connectId, ESendEvents.NOTIFY_FOR_CREATE_ROOM, userPayload);
                emitEventToSocket(resultFromSupportCheck.connectId, ESendEvents.NOTIFY_FOR_CREATE_ROOM, supportPayload);

                // To all the "supports" who have joined
                const supports = await getAllOnlineSupports();
                const usersInQueue = await getAllWaitingUsers();
                supports.forEach((support) => {
                    const payload = {
                        newUserSocketId: connectId,
                        userQueue: usersInQueue,
                    };
                    emitEventToSocket(support, ESendEvents.NOTIFY_ADMINS_OF_NEW_USER, payload);
                });
            } catch (err) {
                console.log('SocketRoute Event ∞ SUPPORT_ACCEPT_USER', err);
            }
        });

        socket.on(EReceiveEvents.USER_ACCEPT_JOIN_TO_ROOM,
            async (data: { roomName: string }) => {
                if (isUndefined(data) || !isString(data.roomName)) {
                    // Please insert correct data
                    console.log('USER_ACCEPT_JOIN_TO_ROOM ~ Incorrect data');
                    return;
                }
                try {

                    const resultFromRoom = await isRoomExist({ roomName: data.roomName, });
                    if (!resultFromRoom?.roomName) {
                        console.log('USER_ACCEPT_JOIN_TO_ROOM ~ room doesn\'t not exist');
                        return;
                    }

                    socket.join(resultFromRoom.roomName);

                } catch (err) {
                    console.log('SocketRoute Event ∞ USER_ACCEPT_JOIN_TO_ROOM', err);
                }
            }
        );

        socket.on(EReceiveEvents.SUPPORT_CHAT_USER_LEAVE, async (data: { roomName: string, connectId: string }) => {
            if (isUndefined(data) || (!isString(data.roomName) && !isString(data.connectId))) {
                console.log('SUPPORT_CHAT_USER_LEAVE ~ Incorrect data');
                // Please insert correct data
                return;
            }
            try {

                const resultFromRoom = await isRoomExist({ roomName: data.roomName, });
                if (resultFromRoom) {
                    socket.leave(resultFromRoom.roomName);

                    await deleteRoom({ roomName: resultFromRoom.roomName, });
                    // Mark conversation is completed
                    return;
                }

                const isUserExist = await isUserInQueue(data);
                if (!isUserExist) {
                    // User Is not exist in UserQueue or this is the Support
                    console.log('SUPPORT_CHAT_USER_LEAVE ~ User doesn\'t exit');
                    return;
                }

                await unassignUserFromQueue(data.connectId);

                const supports = await getAllOnlineSupports();
                const usersInQueue = await getAllWaitingUsers();
                supports.forEach((support) => {
                    const payload = {
                        newUserSocketId: connectId,
                        userQueue: usersInQueue,
                    };
                    emitEventToSocket(support, ESendEvents.NOTIFY_ADMINS_OF_NEW_USER, payload);
                });
            } catch (err) {
                console.log('SocketRoute Event ∞ SUPPORT_CHAT_USER_LEAVE', err);
            }
        });

        socket.on(EReceiveEvents.SUPPORT_MESSAGE, async (data: { roomName: string, message: string }) => {
            if (isUndefined(data) || !isString(data.roomName)) {
                console.log('SUPPORT_MESSAGE ~ Incorrect data');
                // Please insert room name
                return;
            }

            const resultFromRoom = await isRoomExist({ roomName: data.roomName, });
            if (!resultFromRoom?.roomName) {
                console.log('SUPPORT_MESSAGE ~ Doesn\'t exist room');
                // 'room doesn\'t not exist'
                return;
            }
            const messagePayload = {
                roomName: resultFromRoom.roomName,
                message: data.message,
                from: connectId,
            };
            emitEventToSocket(resultFromRoom.roomName, ESendEvents.SUPPORT_MESSAGE, messagePayload);
        });

        // When user disconnects - to all others 
        socket.on('disconnect', async () => {
            console.log(`User ${connectId} disconnected`);

            await setUserInactive(connectId);
            await unassignUserFromQueue(connectId);

            // Mark support to inactive
            // unassignSupport(resultFromSupportCheck.connectId);

            // At disconnect on user send event to everyone else 
            // socket.broadcast.emit('message', `User ${socket.id.substring(0, 5)}} disconnected`);
        });

        // socket.on('disconnecting', (reason) => {
        //     for (const room of socket.rooms) {
        //         if (room !== socket.id) {
        //             socket.to(room).emit('user has left', socket.id);
        //         }
        //     }
        // });
    });
};

export default _socketEvents;

// console.log('Rooms:', io.sockets.adapter.rooms);
// console.log('Room details:', io.sockets.adapter.rooms.get(roomInfo.roomName));