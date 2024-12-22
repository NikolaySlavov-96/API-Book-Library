import db from '../../Model';

import { ModelsInterfaces, } from '../../Model';

interface IInsertMessage {
    resultFromRoom: { roomName: string },
    data: { message: string },
    connectId: string
}
export const insertMessage = async (inData: IInsertMessage): Promise<ModelsInterfaces.IMessageAttributes> => {
    const { resultFromRoom, data, connectId, } = inData;

    const messagePayload = {
        roomName: resultFromRoom.roomName,
        message: data.message,
        senderId: connectId,
    };

    const resultInsert = await db.Message.create(messagePayload);

    return resultInsert?.dataValues;
};