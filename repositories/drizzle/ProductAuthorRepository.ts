import { type TDb } from '../../db';
import { productAuthors } from '../../db/schema';
import { type IProductAuthorRecord, type IProductAuthorRepository } from '../interfaces';

export class ProductAuthorRepository implements IProductAuthorRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: { productId: number; authorId: number }): Promise<IProductAuthorRecord> {
        const [row] = await this.dbWrite.insert(productAuthors).values(input).returning();
        return {
            id: row.id,
            productId: row.productId,
            authorId: row.authorId,
        };
    }
}
