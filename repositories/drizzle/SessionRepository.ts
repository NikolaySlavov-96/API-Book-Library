import { eq } from 'drizzle-orm';

import { type TDb } from '../../db';
import { sessions } from '../../db/schema';
import {
    type TSessionCreateInput,
    type TSessionRecord,
    type TSessionRepository,
    type TSessionUpdateInput,
} from '../types';

export class SessionRepository implements TSessionRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: TSessionCreateInput): Promise<TSessionRecord> {
        const [row] = await this.dbWrite
            .insert(sessions)
            .values({
                connectId: input.connectId,
                connectedAt: input.connectedAt,
                userId: input.userId,
            })
            .returning();
        return row;
    }

    async updateByConnectId(connectId: string, input: TSessionUpdateInput): Promise<void> {
        const updates: Partial<typeof sessions.$inferInsert> = {};
        if (input.userId !== undefined) updates.userId = input.userId;
        if (input.connectedAt !== undefined) updates.connectedAt = input.connectedAt;
        if (input.disconnectedAt !== undefined) updates.disconnectedAt = input.disconnectedAt;

        await this.dbWrite.update(sessions).set(updates).where(eq(sessions.connectId, connectId));
    }
}
