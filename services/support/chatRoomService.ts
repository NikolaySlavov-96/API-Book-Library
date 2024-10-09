interface IActiveRoom {
    roomName: string;
    supportCurrentSocketId: string;
    supportConnectId: string;
    userCurrentSocketId: string;
    userConnectId: string;
}

const activeRooms: IActiveRoom[] = [];

export const initializeRoom = async (supportData, userData) => {
    const supportSocketId = supportData.currentSocketId;
    const userSocketId = userData.currentSocketId;

    const roomName = `${userSocketId}-${supportSocketId}`;

    const supportConnectId = supportData.connected;
    const userConnectId = userData.connectId;

    const newRoom: IActiveRoom = {
        roomName: roomName,
        supportCurrentSocketId: supportSocketId,
        supportConnectId,
        userCurrentSocketId: userSocketId,
        userConnectId,
    };
    activeRooms.push(newRoom);

    return {
        roomName,
    };
};

export const isRoomExist = async (data: { roomName: string }) => {
    return activeRooms.find(r => r.roomName === data.roomName);
};