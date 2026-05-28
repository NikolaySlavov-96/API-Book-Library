import { type TDb } from '../../db';
import { productAuthors } from '../../db/schema';
import { type TProductAuthorCreateInput, type TProductAuthorRecord, type TProductAuthorRepository } from '../types';

export class ProductAuthorRepository implements TProductAuthorRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: TProductAuthorCreateInput): Promise<TProductAuthorRecord> {
        const [row] = await this.dbWrite.insert(productAuthors).values(input).returning();
        return row;
    }
}
