import { EMessageStatus } from '../../constants';
import { repositories, type TMessageRecord } from '../../repositories';
import { type Principal } from '../principalService';

interface IInsertMessage {
    resultFromRoom: { roomName: string };
    data: { message: string };
    principal: Principal;
    senderUserId: number | null;
}

export interface IMessageWithStatus extends TMessageRecord {
    status: EMessageStatus;
}

export const insertMessage = async (inData: IInsertMessage): Promise<IMessageWithStatus> => {
    const { resultFromRoom, data, principal, senderUserId } = inData;

    const row = await repositories.message.create({
        roomName: resultFromRoom.roomName,
        message: data.message,
        senderId: principal,
        senderUserId,
    });

    await repositories.messageStatus.createIfNotExists({
        messageId: row.id,
        status: EMessageStatus.SENT,
    });

    return { ...row, status: EMessageStatus.SENT };
};

export const recordMessageStatus = async (
    messageId: number,
    status: EMessageStatus,
): Promise<{ messageId: number; status: EMessageStatus; updatedAt: string } | null> => {
    const created = await repositories.messageStatus.createIfNotExists({ messageId, status });
    if (!created) return null;
    return {
        messageId: created.messageId,
        status: created.status as EMessageStatus,
        updatedAt: created.updatedAt.toISOString(),
    };
};
