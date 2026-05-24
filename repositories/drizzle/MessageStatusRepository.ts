import { type TDb } from '../../db';
import { messageStatuses } from '../../db/schema';
import {
    type IMessageStatusCreateInput,
    type IMessageStatusRecord,
    type IMessageStatusRepository,
} from '../interfaces';

export class MessageStatusRepository implements IMessageStatusRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: IMessageStatusCreateInput): Promise<IMessageStatusRecord> {
        const [row] = await this.dbWrite.insert(messageStatuses).values(input).returning();
        return row;
    }
}
