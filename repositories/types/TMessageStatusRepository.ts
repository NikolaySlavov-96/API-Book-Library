import { type TMessageStatusRow } from '../../db/schema';

export type TMessageStatusRecord = TMessageStatusRow;

export type TMessageStatusCreateInput = Pick<TMessageStatusRow, 'messageId' | 'status'>;

export type TMessageStatusRepository = {
    create(input: TMessageStatusCreateInput): Promise<TMessageStatusRecord>;
    createIfNotExists(input: TMessageStatusCreateInput): Promise<TMessageStatusRecord | null>;
};
