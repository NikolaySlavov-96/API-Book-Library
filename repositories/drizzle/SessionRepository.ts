import { eq } from 'drizzle-orm';

import { type TDb } from '../../db';
import { sessions, users } from '../../db/schema';
import {
    type ISessionCreateInput,
    type ISessionRecord,
    type ISessionRepository,
    type ISessionUpdateInput,
    type ISessionWithUser,
} from '../interfaces';

const toRecord = (row: typeof sessions.$inferSelect): ISessionRecord => ({
    id: row.id,
    connectId: row.connectId ?? null,
    userId: row.userId ?? null,
    connectedAt: row.connectedAt ?? null,
    disconnectedAt: row.disconnectedAt ?? null,
});

export class SessionRepository implements ISessionRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async create(input: ISessionCreateInput): Promise<ISessionRecord> {
        const [row] = await this.dbWrite
            .insert(sessions)
            .values({
                connectId: input.connectId,
                connectedAt: input.connectedAt,
                userId: input.userId,
            })
            .returning();
        return toRecord(row);
    }

    async updateByConnectId(connectId: string, input: ISessionUpdateInput): Promise<void> {
        const updates: Partial<typeof sessions.$inferInsert> = {};
        if (input.userId !== undefined) updates.userId = input.userId;
        if (input.connectedAt !== undefined) updates.connectedAt = input.connectedAt;
        if (input.disconnectedAt !== undefined) updates.disconnectedAt = input.disconnectedAt;

        await this.dbWrite.update(sessions).set(updates).where(eq(sessions.connectId, connectId));
    }

    async findByConnectIdWithUser(connectId: string): Promise<ISessionWithUser | null> {
        const [row] = await this.dbRead
            .select({
                session: sessions,
                user: {
                    id: users.id,
                    role: users.role,
                    email: users.email,
                },
            })
            .from(sessions)
            .leftJoin(users, eq(sessions.userId, users.id))
            .where(eq(sessions.connectId, connectId))
            .limit(1);

        if (!row) {
            return null;
        }

        return {
            ...toRecord(row.session),
            user: row.user?.id ? row.user : null,
        };
    }
}
