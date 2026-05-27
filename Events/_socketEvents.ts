import isEmpty from 'lodash/isEmpty.js';
import isString from 'lodash/isString.js';
import isUndefined from 'lodash/isUndefined.js';

import { EMessageStatus, EReceiveEvents, ESendEvents, MESSAGES } from '../constants';
import { createLogger, notifySupportsOfNewUser } from '../Helpers';
import { incrementWithTtl } from '../services/cacheService';
import { registerNewVisitor, setUserInactive } from '../services/connectManagerService';
import { promoteAnonToUser } from '../services/principalMigrationService';
import { derivePrincipal, isTokenExpired, type PrincipalInfo, principalRoom } from '../services/principalService';
import {
    deleteRoom,
    initializeRoom,
    isRoomExist,
    isRoomMember,
    removeRoomMember,
} from '../services/support/chatRoomService';
import { insertMessage, recordMessageStatus } from '../services/support/messageService';
import {
    assignSupport,
    assignUserToQueue,
    getAllWaitingUsers,
    isSupportAgent,
    isUserInQueue,
    unassignSupport,
    unassignUserFromQueue,
} from '../services/support/supportManagerService';
import { storeVisitorInfo } from '../services/visitorService';
import { updateMessage } from '../util';

import { emitEventToPrincipal } from './_SocketEmitters';

const log = createLogger('socketEvents');

interface IUserConnect {
    country_code: string;
    country_name: string;
    city: string | null;
    postal: string | null;
    latitude: number;
    longitude: number;
    IPv4: string;
    state: string | null;
}

const WELCOME_USER_TEXT = 'Welcome to Support Chat! A consultant will see you shortly.';
const WELCOME_ADMIN_TEXT = 'Welcome to Support Chat Admin!';

// Distributed rate limiter: max RATE_MAX_EVENTS per RATE_WINDOW_MS, keyed by principal.
const RATE_WINDOW_MS = 1000;
const RATE_MAX_EVENTS = 5;
const rateKey = (principal: string) => `rate:socket:${principal}`;

const checkRateLimit = async (principal: string): Promise<boolean> => {
    try {
        const count = await incrementWithTtl(rateKey(principal), RATE_WINDOW_MS);
        return count > RATE_MAX_EVENTS;
    } catch {
        return false;
    }
};

const sanitizeMessage = (raw: unknown): string | null => {
    if (!isString(raw)) return null;
    const trimmed = raw.trim();
    if (!trimmed) return null;
    return trimmed;
};

// TODO(lint): type `socket` as `Socket` from socket.io (no-explicit-any).
const getPrincipalInfo = (socket: any): PrincipalInfo => {
    return socket.data.principalInfo as PrincipalInfo;
};

// TODO(lint): type `socket` as `Socket` from socket.io (no-explicit-any).
const requireValidSession = (socket: any): PrincipalInfo | null => {
    const info = getPrincipalInfo(socket);
    if (!info.isAnonymous && isTokenExpired(info.tokenExp)) {
        socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.EXPIRED_TOKEN).user);
        socket.disconnect(true);
        return null;
    }
    return info;
};

const _socketEvents = (io) => {
    io.on('connection', async (socket) => {
        const connectId = socket.id as string;

        const principalInfo = derivePrincipal(socket.handshake);
        if (!principalInfo) {
            socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.INVALID_AUTHORIZE_TOKEN).user);
            socket.disconnect(true);
            return;
        }

        const handshakeClientId = socket.handshake?.auth?.clientId;
        if (!principalInfo.isAnonymous && principalInfo.userId !== null && typeof handshakeClientId === 'string') {
            try {
                const displayName = principalInfo.email ? principalInfo.email.split('@')[0] : undefined;
                const result = await promoteAnonToUser(handshakeClientId, principalInfo.userId, displayName);
                if (result.migrated) {
                    for (const roomName of result.roomsTouched) {
                        socket.join(roomName);
                    }
                    await notifySupportsOfNewUser(principalInfo.principal);
                }
            } catch (err) {
                log.error('SocketRoute Event ∞ promoteAnonToUser', err);
            }
        }

        socket.data.principalInfo = principalInfo;

        socket.join(principalRoom(principalInfo.principal));

        await registerNewVisitor(connectId, socket.handshake?.auth?.token);

        socket.on(EReceiveEvents.USER_CONNECT, async (data: IUserConnect) => {
            if (!isEmpty(data)) {
                const count = await storeVisitorInfo(data);
                if (count.isNewUser) {
                    socket.broadcast.emit(ESendEvents.USER_CONNECT, count);
                }
                socket.emit(ESendEvents.USER_CONNECT, count);
            }
        });

        socket.on(EReceiveEvents.SUPPORT_CHAT_USER_JOIN, async () => {
            try {
                const info = requireValidSession(socket);
                if (!info) return;
                if (await checkRateLimit(info.principal)) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.RATE_LIMIT).user);
                    return;
                }

                if (info.role === 'support') {
                    await assignSupport(info.principal);
                    const userQueue = await getAllWaitingUsers();
                    socket.emit(ESendEvents.NOTIFY_ADMINS_OF_NEW_USER, {
                        newUserPrincipal: '',
                        userQueue,
                    });
                    socket.emit(ESendEvents.SUPPORT_CHAT_USER_JOIN_ACKNOWLEDGMENT, {
                        message: WELCOME_ADMIN_TEXT,
                        principal: info.principal,
                    });
                    return;
                }

                const displayName = info.email ? info.email.split('@')[0] : 'Anonymous';
                await assignUserToQueue({ principal: info.principal, name: displayName });
                await notifySupportsOfNewUser(info.principal);

                socket.emit(ESendEvents.SUPPORT_CHAT_USER_JOIN_ACKNOWLEDGMENT, {
                    message: WELCOME_USER_TEXT,
                    principal: info.principal,
                });
            } catch (err) {
                socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.ERROR_FROM_SERVER).user);
                log.error('SocketRoute Event ∞ SUPPORT_CHAT_USER_JOIN', err);
            }
        });

        socket.on(EReceiveEvents.SUPPORT_ACCEPT_USER, async (data: { acceptUserPrincipal: string }) => {
            try {
                const info = requireValidSession(socket);
                if (!info) return;
                if (await checkRateLimit(info.principal)) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.RATE_LIMIT).user);
                    return;
                }
                if (isUndefined(data) || !isString(data?.acceptUserPrincipal)) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.INCORRECT_DATA).user);
                    return;
                }

                if (info.role !== 'support' || !(await isSupportAgent(info.principal))) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.NOT_AUTHORIZE_ACCEPT_CHAT_REQUEST).user);
                    return;
                }

                const queued = await isUserInQueue(data.acceptUserPrincipal);
                if (!queued) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.SELECTED_USER_NOT_FOUND).user);
                    return;
                }

                const roomInfo = await initializeRoom([info.principal, queued.principal]);
                socket.join(roomInfo.roomName);

                await unassignUserFromQueue(queued.principal);

                const supportDisplayName = info.email ? info.email.split('@')[0] : 'Support';
                emitEventToPrincipal(queued.principal, ESendEvents.NOTIFY_FOR_CREATE_ROOM, {
                    roomName: roomInfo.roomName,
                    message: `Support with name ${supportDisplayName} is accepted your request`,
                });
                emitEventToPrincipal(info.principal, ESendEvents.NOTIFY_FOR_CREATE_ROOM, {
                    roomName: roomInfo.roomName,
                    message: 'support',
                });

                await notifySupportsOfNewUser(info.principal);
            } catch (err) {
                socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.ERROR_FROM_SERVER).user);
                log.error('SocketRoute Event ∞ SUPPORT_ACCEPT_USER', err);
            }
        });

        socket.on(EReceiveEvents.USER_ACCEPT_JOIN_TO_ROOM, async (data: { roomName: string }) => {
            if (isUndefined(data) || !isString(data?.roomName)) {
                socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.INCORRECT_DATA).user);
                return;
            }
            try {
                const info = requireValidSession(socket);
                if (!info) return;
                if (await checkRateLimit(info.principal)) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.RATE_LIMIT).user);
                    return;
                }

                const resultFromRoom = await isRoomExist({ roomName: data.roomName });
                if (!resultFromRoom?.roomName) {
                    socket.emit(ESendEvents.COMPLETE_ISSUE, { message: 'Complete', issue: data.roomName });
                    return;
                }

                const allowed = await isRoomMember(resultFromRoom.roomName, info.principal);
                if (!allowed) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.NOT_ROOM_MEMBER).user);
                    return;
                }

                socket.join(resultFromRoom.roomName);
            } catch (err) {
                socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.ERROR_FROM_SERVER).user);
                log.error('SocketRoute Event ∞ USER_ACCEPT_JOIN_TO_ROOM', err);
            }
        });

        socket.on(EReceiveEvents.SUPPORT_CHAT_USER_LEAVE, async (data: { roomName?: string }) => {
            if (isUndefined(data)) {
                socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.INCORRECT_DATA).user);
                return;
            }
            try {
                const info = requireValidSession(socket);
                if (!info) return;
                if (await checkRateLimit(info.principal)) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.RATE_LIMIT).user);
                    return;
                }

                if (isString(data.roomName) && data.roomName) {
                    const resultFromRoom = await isRoomExist({ roomName: data.roomName });
                    if (resultFromRoom.roomName) {
                        const allowed = await isRoomMember(resultFromRoom.roomName, info.principal);
                        if (!allowed) {
                            socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.NOT_ROOM_MEMBER).user);
                            return;
                        }

                        io.to(resultFromRoom.roomName).emit(ESendEvents.COMPLETE_ISSUE, {
                            message: 'Complete',
                            issue: resultFromRoom.roomName,
                        });

                        await deleteRoom({ roomName: resultFromRoom.roomName });
                        socket.leave(resultFromRoom.roomName);
                        return;
                    }

                    socket.emit(ESendEvents.COMPLETE_ISSUE, {
                        message: 'Complete',
                        issue: data.roomName,
                    });
                    return;
                }

                const queued = await isUserInQueue(info.principal);
                if (!queued) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.SELECTED_USER_NOT_FOUND).user);
                    return;
                }

                await unassignUserFromQueue(info.principal);
                await notifySupportsOfNewUser(info.principal);
            } catch (err) {
                socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.ERROR_FROM_SERVER).user);
                log.error('SocketRoute Event ∞ SUPPORT_CHAT_USER_LEAVE', err);
            }
        });

        socket.on(EReceiveEvents.SUPPORT_MESSAGE, async (data: { roomName: string; message: string }) => {
            if (isUndefined(data) || !isString(data?.roomName)) {
                socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.INCORRECT_DATA).user);
                return;
            }

            try {
                const info = requireValidSession(socket);
                if (!info) return;
                if (await checkRateLimit(info.principal)) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.RATE_LIMIT).user);
                    return;
                }

                const cleanMessage = sanitizeMessage(data.message);
                if (cleanMessage === null) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.INCORRECT_DATA).user);
                    return;
                }

                const resultFromRoom = await isRoomExist({ roomName: data.roomName });
                if (!resultFromRoom?.roomName) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.SELECTED_ROOM_NOT_FOUND).user);
                    return;
                }

                const allowed = await isRoomMember(resultFromRoom.roomName, info.principal);
                if (!allowed) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.NOT_ROOM_MEMBER).user);
                    return;
                }

                const result = await insertMessage({
                    resultFromRoom: { roomName: resultFromRoom.roomName },
                    data: { message: cleanMessage },
                    principal: info.principal,
                    senderUserId: info.userId,
                });
                io.to(resultFromRoom.roomName).emit(ESendEvents.SUPPORT_MESSAGE, result);
            } catch (err) {
                socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.ERROR_FROM_SERVER).user);
                log.error('SocketRoute Event ∞ SUPPORT_MESSAGE', err);
            }
        });

        const handleMessageStatusEvent = async (
            data: { roomName: string; messageId: number },
            status: EMessageStatus,
            logTag: string,
        ) => {
            if (isUndefined(data) || !isString(data?.roomName) || typeof data?.messageId !== 'number') {
                socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.INCORRECT_DATA).user);
                return;
            }

            try {
                const info = requireValidSession(socket);
                if (!info) return;
                if (await checkRateLimit(info.principal)) return;

                const resultFromRoom = await isRoomExist({ roomName: data.roomName });
                if (!resultFromRoom?.roomName) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.SELECTED_ROOM_NOT_FOUND).user);
                    return;
                }

                const allowed = await isRoomMember(resultFromRoom.roomName, info.principal);
                if (!allowed) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.NOT_ROOM_MEMBER).user);
                    return;
                }

                const recorded = await recordMessageStatus(data.messageId, status);
                if (!recorded) return;

                io.to(resultFromRoom.roomName).emit(ESendEvents.SUPPORT_MESSAGE_STATUS, {
                    roomName: resultFromRoom.roomName,
                    messageId: recorded.messageId,
                    status: recorded.status,
                    updatedAt: recorded.updatedAt,
                });
            } catch (err) {
                socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.ERROR_FROM_SERVER).user);
                log.error(`SocketRoute Event ∞ ${logTag}`, err);
            }
        };

        socket.on(EReceiveEvents.SUPPORT_MESSAGE_DELIVERED, (data: { roomName: string; messageId: number }) => {
            void handleMessageStatusEvent(data, EMessageStatus.DELIVERED, 'SUPPORT_MESSAGE_DELIVERED');
        });

        socket.on(EReceiveEvents.SUPPORT_MESSAGE_SEEN, (data: { roomName: string; messageId: number }) => {
            void handleMessageStatusEvent(data, EMessageStatus.SEEN, 'SUPPORT_MESSAGE_SEEN');
        });

        socket.on(EReceiveEvents.SUPPORT_ACTIVITY, async (data: { roomName: string }) => {
            if (!isString(data?.roomName)) {
                socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.INCORRECT_DATA).user);
                return;
            }

            try {
                const info = requireValidSession(socket);
                if (!info) return;
                if (await checkRateLimit(info.principal)) return;

                const resultFromRoom = await isRoomExist({ roomName: data.roomName });
                if (!resultFromRoom?.roomName) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.SELECTED_ROOM_NOT_FOUND).user);
                    return;
                }

                const allowed = await isRoomMember(resultFromRoom.roomName, info.principal);
                if (!allowed) {
                    socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.NOT_ROOM_MEMBER).user);
                    return;
                }

                socket.to(resultFromRoom.roomName).emit(ESendEvents.SUPPORT_ACTIVITY, {
                    principal: info.principal,
                });
            } catch (err) {
                socket.emit(ESendEvents.ERROR, updateMessage(MESSAGES.ERROR_FROM_SERVER).user);
                log.error('SocketRoute Event ∞ SUPPORT_ACTIVITY', err);
            }
        });

        socket.on('disconnecting', async () => {
            try {
                await setUserInactive(connectId);

                const sockets = await io.in(principalRoom(principalInfo.principal)).fetchSockets();
                const stillOnline = sockets.some((s) => s.id !== connectId);
                if (stillOnline) return;

                // TODO(lint): batch with Promise.all so room removals run in parallel (no-await-in-loop).
                for (const roomName of socket.rooms) {
                    if (roomName !== connectId && !roomName.startsWith('principal:')) {
                        await removeRoomMember(roomName, principalInfo.principal);
                    }
                }

                const removedFromQueue = await unassignUserFromQueue(principalInfo.principal);
                if (removedFromQueue) {
                    await notifySupportsOfNewUser(principalInfo.principal);
                }

                await unassignSupport(principalInfo.principal);
            } catch (err) {
                log.error('SocketRoute Event ∞ disconnecting', err);
            }
        });
    });
};

export default _socketEvents;

// console.log('Rooms:', io.sockets.adapter.rooms);
// console.log('Room details:', io.sockets.adapter.rooms.get(roomInfo.roomName));
