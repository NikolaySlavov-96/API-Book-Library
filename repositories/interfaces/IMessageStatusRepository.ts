import { type TMessageStatusRow } from '../../db/schema';

export type IMessageStatusRecord = TMessageStatusRow;

export type IMessageStatusCreateInput = Pick<TMessageStatusRow, 'messageId' | 'status'>;

export interface IMessageStatusRepository {
    create(input: IMessageStatusCreateInput): Promise<IMessageStatusRecord>;
}
