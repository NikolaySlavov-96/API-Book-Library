import { type TMessageRow } from '../../db/schema';

export type IMessageRecord = TMessageRow;

export type IMessageCreateInput = Pick<TMessageRow, 'roomName' | 'senderId' | 'message'>;

export interface IMessageRepository {
    create(input: IMessageCreateInput): Promise<IMessageRecord>;
}
