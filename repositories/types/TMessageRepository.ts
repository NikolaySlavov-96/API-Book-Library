import { type TMessageRow } from '../../db/schema';

export type TMessageRecord = TMessageRow;

export type TMessageCreateInput = Pick<TMessageRow, 'roomName' | 'senderId' | 'message'> & {
    senderUserId: number | null;
};

export type TMessageRepository = {
    create(input: TMessageCreateInput): Promise<TMessageRecord>;
};
