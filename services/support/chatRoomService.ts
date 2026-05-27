import { cacheKeys } from '../../constants';
import { UUID } from '../../util';
import {
    addDataToSet,
    deleteCacheEntry,
    fetchSetMembers,
    isSetMember,
    removeDataFromSet,
    setKeyExpiration,
} from '../cacheService';
import { type Principal } from '../principalService';

const ISSUE_TICKET_NAME = 'IssTktTNum-';
const ROOM_TTL_SECONDS = 24 * 60 * 60;

const membersKey = (roomName: string) => `${cacheKeys.CHAT_ROOM}:members:${roomName}`;

export const initializeRoom = async (memberPrincipals: Principal[]) => {
    const roomName = `${ISSUE_TICKET_NAME}${UUID()}`;

    await addDataToSet(cacheKeys.CHAT_ROOM, roomName);

    const mKey = membersKey(roomName);
    await addDataToSet(mKey, memberPrincipals);
    await setKeyExpiration(mKey, ROOM_TTL_SECONDS);

    return { roomName };
};

export const isRoomExist = async (data: { roomName: string }) => {
    if (!data?.roomName) return { roomName: undefined };
    const exists = await isSetMember(cacheKeys.CHAT_ROOM, data.roomName);
    return { roomName: exists ? data.roomName : undefined };
};

export const isRoomMember = async (roomName: string, principal: Principal): Promise<boolean> => {
    if (!roomName || !principal) return false;
    return isSetMember(membersKey(roomName), principal);
};

export const removeRoomMember = async (roomName: string, principal: Principal) => {
    if (!roomName || !principal) return;
    await removeDataFromSet(membersKey(roomName), principal);
};

export const deleteRoom = async (data: { roomName: string }) => {
    await removeDataFromSet(cacheKeys.CHAT_ROOM, data.roomName);
    await deleteCacheEntry(membersKey(data.roomName));
};

export const migrateRoomMemberships = async (oldPrincipal: Principal, newPrincipal: Principal): Promise<string[]> => {
    const rooms = await fetchSetMembers(cacheKeys.CHAT_ROOM);
    const touched: string[] = [];

    // TODO(lint): parallelize per-room migration via Promise.all (no-await-in-loop x3).
    for (const roomName of rooms) {
        const mKey = membersKey(roomName);
        if (await isSetMember(mKey, oldPrincipal)) {
            await addDataToSet(mKey, newPrincipal);
            await removeDataFromSet(mKey, oldPrincipal);
            touched.push(roomName);
        }
    }

    return touched;
};
