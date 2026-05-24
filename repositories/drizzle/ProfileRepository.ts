import { eq } from 'drizzle-orm';

import { type TDb } from '../../db';
import { files, profiles } from '../../db/schema';
import {
    type IProfileCreateInput,
    type IProfileRecord,
    type IProfileRepository,
    type IProfileUpdateInput,
    type IProfileWithAvatar,
} from '../interfaces';

const toRecord = (row: typeof profiles.$inferSelect): IProfileRecord => ({
    id: row.id,
    userId: row.userId,
    year: row.year,
    readingGoal: row.readingGoal,
    displayName: row.displayName ?? null,
    avatarFileId: row.avatarFileId ?? null,
    notifyByEmail: row.notifyByEmail,
});

export class ProfileRepository implements IProfileRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async create(input: IProfileCreateInput): Promise<IProfileRecord> {
        const [row] = await this.dbWrite
            .insert(profiles)
            .values({ userId: input.userId, year: input.year })
            .returning();
        return toRecord(row);
    }

    async findByUserId(userId: number): Promise<IProfileRecord | null> {
        const [row] = await this.dbRead.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
        return row ? toRecord(row) : null;
    }

    async findByUserIdWithAvatar(userId: number): Promise<IProfileWithAvatar | null> {
        const [row] = await this.dbRead
            .select({
                profile: profiles,
                avatar: {
                    id: files.id,
                    src: files.src,
                    uniqueName: files.uniqueName,
                },
            })
            .from(profiles)
            .leftJoin(files, eq(profiles.avatarFileId, files.id))
            .where(eq(profiles.userId, userId))
            .limit(1);

        if (!row) {
            return null;
        }

        return {
            ...toRecord(row.profile),
            avatar: row.avatar?.id ? row.avatar : null,
        };
    }

    async updateByUserId(userId: number, input: IProfileUpdateInput): Promise<IProfileRecord | null> {
        const updates: Partial<typeof profiles.$inferInsert> = { updatedAt: new Date() };
        if (input.readingGoal !== undefined) updates.readingGoal = input.readingGoal;
        if (input.displayName !== undefined) updates.displayName = input.displayName ?? null;
        if (input.avatarFileId !== undefined) updates.avatarFileId = input.avatarFileId ?? null;
        if (input.notifyByEmail !== undefined) updates.notifyByEmail = input.notifyByEmail;

        const [row] = await this.dbWrite.update(profiles).set(updates).where(eq(profiles.userId, userId)).returning();
        return row ? toRecord(row) : null;
    }
}
