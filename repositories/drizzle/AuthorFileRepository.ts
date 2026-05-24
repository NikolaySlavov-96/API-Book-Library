import { type TDb } from '../../db';
import { authorFiles } from '../../db/schema';
import { type IAuthorFileCreateInput, type IAuthorFileRecord, type IAuthorFileRepository } from '../interfaces';

export class AuthorFileRepository implements IAuthorFileRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: IAuthorFileCreateInput): Promise<IAuthorFileRecord> {
        const [row] = await this.dbWrite.insert(authorFiles).values(input).returning();
        return row;
    }
}
