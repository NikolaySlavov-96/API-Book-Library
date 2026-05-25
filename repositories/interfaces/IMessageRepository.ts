import { type TMessageRow } from '../../db/schema';

export type IMessageRecord = TMessageRow;

export type IMessageCreateInput = Pick<TMessageRow, 'roomName' | 'senderId' | 'message'> & {
    senderUserId: number | null;
};

export interface IMessageRepository {
    create(input: IMessageCreateInput): Promise<IMessageRecord>;
}
