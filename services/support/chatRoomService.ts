import { UUID, } from '../../util';

const ISSUE_TICKET_NAME = 'IssTktTNum-';

interface IActiveRoom {
    roomName: string;
    supportCurrentSocketId: string;
    userCurrentSocketId: string;
}

const activeRooms: IActiveRoom[] = [];

export const initializeRoom = async (supportData, userData) => {
    const supportSocketId = supportData.connectId;
    const userSocketId = userData.connectId;

    const issueTicketNumber = UUID().substring(0, 8);
    const roomName = `${ISSUE_TICKET_NAME}${issueTicketNumber}`;

    const newRoom: IActiveRoom = {
        roomName: roomName,
        supportCurrentSocketId: supportSocketId,
        userCurrentSocketId: userSocketId,
    };
    activeRooms.push(newRoom);

    return {
        roomName,
    };
};

export const isRoomExist = async (data: { roomName: string }) => {
    return activeRooms.find(r => r.roomName === data.roomName);
};

export const deleteRoom = async (data: { roomName: string }) => {
    activeRooms.filter(r => r.roomName !== data.roomName);
};