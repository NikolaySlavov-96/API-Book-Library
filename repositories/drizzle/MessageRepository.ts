import { type TDb } from '../../db';
import { messages } from '../../db/schema';
import { type TMessageCreateInput, type TMessageRecord, type TMessageRepository } from '../types';

export class MessageRepository implements TMessageRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: TMessageCreateInput): Promise<TMessageRecord> {
        const [row] = await this.dbWrite.insert(messages).values(input).returning();
        return row;
    }
}
