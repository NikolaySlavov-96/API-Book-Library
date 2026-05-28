import { eq } from 'drizzle-orm';

import { type TDb } from '../../db';
import { authors } from '../../db/schema';
import { type TAuthorCreateInput, type TAuthorRecord, type TAuthorRepository } from '../types';

export class AuthorRepository implements TAuthorRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async findByName(name: string): Promise<TAuthorRecord | null> {
        const [row] = await this.dbRead.select().from(authors).where(eq(authors.name, name)).limit(1);
        return row ?? null;
    }

    async create(input: TAuthorCreateInput): Promise<TAuthorRecord> {
        const [row] = await this.dbWrite.insert(authors).values({ name: input.name, genre: input.genre }).returning();
        return row;
    }
}
