import { eq } from 'drizzle-orm';

import { type TDb } from '../../db';
import { authors } from '../../db/schema';
import { type IAuthorCreateInput, type IAuthorRecord, type IAuthorRepository } from '../interfaces';

export class AuthorRepository implements IAuthorRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async findByName(name: string): Promise<IAuthorRecord | null> {
        const [row] = await this.dbRead.select().from(authors).where(eq(authors.name, name)).limit(1);
        return row ?? null;
    }

    async create(input: IAuthorCreateInput): Promise<IAuthorRecord> {
        const [row] = await this.dbWrite.insert(authors).values({ name: input.name, genre: input.genre }).returning();
        return row;
    }
}
