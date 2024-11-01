interface IActiveRoom {
    roomName: string;
    supportCurrentSocketId: string;
    // supportConnectId: string;
    userCurrentSocketId: string;
    // userConnectId: string;
}

const activeRooms: IActiveRoom[] = [];

export const initializeRoom = async (supportData, userData) => {
    const supportSocketId = supportData.connectId;
    const userSocketId = userData.connectId;

    const roomName = `IssueRoom≈${userSocketId.substring(0, 5)}-${supportSocketId.substring(0, 5)}`;

    // const supportConnectId = supportData.connected;
    // const userConnectId = userData.connectId;

    const newRoom: IActiveRoom = {
        roomName: roomName,
        supportCurrentSocketId: supportSocketId,
        // supportConnectId,
        userCurrentSocketId: userSocketId,
        // userConnectId,
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