import { type TDb } from '../../db';
import { messageStatuses } from '../../db/schema';
import { type TMessageStatusCreateInput, type TMessageStatusRecord, type TMessageStatusRepository } from '../types';

export class MessageStatusRepository implements TMessageStatusRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: TMessageStatusCreateInput): Promise<TMessageStatusRecord> {
        const [row] = await this.dbWrite.insert(messageStatuses).values(input).returning();
        return row;
    }

    async createIfNotExists(input: TMessageStatusCreateInput): Promise<TMessageStatusRecord | null> {
        const [row] = await this.dbWrite
            .insert(messageStatuses)
            .values(input)
            .onConflictDoNothing({ target: [messageStatuses.messageId, messageStatuses.status] })
            .returning();
        return row ?? null;
    }
}
