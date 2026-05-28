import { eq } from 'drizzle-orm';

import { type TDb } from '../../db';
import { files, profiles } from '../../db/schema';
import {
    type TProfileCreateInput,
    type TProfileRecord,
    type TProfileRepository,
    type TProfileUpdateInput,
    type TProfileWithAvatar,
} from '../types';

export class ProfileRepository implements TProfileRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async create(input: TProfileCreateInput): Promise<TProfileRecord> {
        const [row] = await this.dbWrite
            .insert(profiles)
            .values({ userId: input.userId, year: input.year })
            .returning();
        return row;
    }

    async findByUserId(userId: number): Promise<TProfileRecord | null> {
        const [row] = await this.dbRead.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
        return row ?? null;
    }

    async findByUserIdWithAvatar(userId: number): Promise<TProfileWithAvatar | null> {
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
            ...row.profile,
            avatar: row.avatar?.id ? row.avatar : null,
        };
    }

    async updateByUserId(userId: number, input: TProfileUpdateInput): Promise<TProfileRecord | null> {
        const updates: Partial<typeof profiles.$inferInsert> = { updatedAt: new Date() };
        if (input.readingGoal !== undefined) updates.readingGoal = input.readingGoal;
        if (input.displayName !== undefined) updates.displayName = input.displayName ?? null;
        if (input.avatarFileId !== undefined) updates.avatarFileId = input.avatarFileId ?? null;
        if (input.notifyByEmail !== undefined) updates.notifyByEmail = input.notifyByEmail;

        const [row] = await this.dbWrite.update(profiles).set(updates).where(eq(profiles.userId, userId)).returning();
        return row ?? null;
    }
}
