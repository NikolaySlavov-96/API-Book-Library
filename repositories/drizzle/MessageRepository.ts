import { type TDb } from '../../db';
import { messages } from '../../db/schema';
import { type IMessageCreateInput, type IMessageRecord, type IMessageRepository } from '../interfaces';

export class MessageRepository implements IMessageRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: IMessageCreateInput): Promise<IMessageRecord> {
        const [row] = await this.dbWrite.insert(messages).values(input).returning();
        return row;
    }
}
