import { type TDb } from '../../db';
import { authorFiles } from '../../db/schema';
import { type TAuthorFileCreateInput, type TAuthorFileRecord, type TAuthorFileRepository } from '../types';

export class AuthorFileRepository implements TAuthorFileRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: TAuthorFileCreateInput): Promise<TAuthorFileRecord> {
        const [row] = await this.dbWrite.insert(authorFiles).values(input).returning();
        return row;
    }
}
