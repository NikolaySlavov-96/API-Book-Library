import { cacheKeys, } from '../../constants';

import { UUID, } from '../../util';

import { addedStringToList, fetchListMembers, removeElementFromList, } from '../cacheService';

const ISSUE_TICKET_NAME = 'IssTktTNum-';

export const fetchAllRooms = async () => {
    return await fetchListMembers(cacheKeys.CHAT_ROOM);
};

export const initializeRoom = async () => {
    const issueTicketNumber = UUID().substring(0, 8);
    const roomName = `${ISSUE_TICKET_NAME}${issueTicketNumber}`;

    await addedStringToList(cacheKeys.CHAT_ROOM, roomName);

    return {
        roomName,
    };
};

export const isRoomExist = async (data: { roomName: string }) => {
    const supportAgents = await fetchListMembers(cacheKeys.CHAT_ROOM);
    const roomName = supportAgents.find((r) => r === data.roomName);
    return { roomName, };
};

export const deleteRoom = async (data: { roomName: string }) => {
    await removeElementFromList(cacheKeys.CHAT_ROOM, data.roomName);
};