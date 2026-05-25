import { type IMessageRecord, repositories } from '../../repositories';
import { type Principal } from '../principalService';

interface IInsertMessage {
    resultFromRoom: { roomName: string };
    data: { message: string };
    principal: Principal;
    senderUserId: number | null;
}

export const insertMessage = async (inData: IInsertMessage): Promise<IMessageRecord> => {
    const { resultFromRoom, data, principal, senderUserId } = inData;

    return repositories.message.create({
        roomName: resultFromRoom.roomName,
        message: data.message,
        senderId: principal,
        senderUserId,
    });
};
