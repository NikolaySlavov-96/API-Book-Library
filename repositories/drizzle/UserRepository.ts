import { count, eq } from 'drizzle-orm';

import { type TDb } from '../../db';
import { users } from '../../db/schema';
import { type IUserCreateInput, type IUserRecord, type IUserRepository } from '../interfaces';

export class UserRepository implements IUserRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async findById(id: number | string): Promise<IUserRecord | null> {
        const numericId = typeof id === 'string' ? Number(id) : id;
        if (!Number.isFinite(numericId)) {
            return null;
        }

        const [row] = await this.dbRead.select().from(users).where(eq(users.id, numericId)).limit(1);
        return row ?? null;
    }

    async findByEmail(email: string): Promise<IUserRecord | null> {
        const [row] = await this.dbRead.select().from(users).where(eq(users.email, email)).limit(1);
        return row ?? null;
    }

    async countByEmail(email: string): Promise<number> {
        const [row] = await this.dbRead.select({ value: count() }).from(users).where(eq(users.email, email));
        return Number(row?.value ?? 0);
    }

    async create(input: IUserCreateInput): Promise<IUserRecord> {
        const [row] = await this.dbWrite
            .insert(users)
            .values({ email: input.email, password: input.password ?? null })
            .returning();
        return row;
    }

    async markVerified(id: number): Promise<void> {
        await this.dbWrite.update(users).set({ isVerify: true }).where(eq(users.id, id));
    }
}
