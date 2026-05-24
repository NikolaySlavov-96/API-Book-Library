import { type TDb } from '../../db';
import { authorFiles } from '../../db/schema';
import { type IAuthorFileRecord, type IAuthorFileRepository } from '../interfaces';

export class AuthorFileRepository implements IAuthorFileRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: { authorId: number; fileId: number }): Promise<IAuthorFileRecord> {
        const [row] = await this.dbWrite.insert(authorFiles).values(input).returning();
        return {
            id: row.id,
            authorId: row.authorId,
            fileId: row.fileId,
        };
    }
}
