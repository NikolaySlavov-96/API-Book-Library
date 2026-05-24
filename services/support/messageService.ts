import { type IMessageRecord, repositories } from '../../repositories';

interface IInsertMessage {
    resultFromRoom: { roomName: string };
    data: { message: string };
    connectId: string;
}

export const insertMessage = async (inData: IInsertMessage): Promise<IMessageRecord> => {
    const { resultFromRoom, data, connectId } = inData;

    return repositories.message.create({
        roomName: resultFromRoom.roomName,
        message: data.message,
        senderId: connectId,
    });
};
