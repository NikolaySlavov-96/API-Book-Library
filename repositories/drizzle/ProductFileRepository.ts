import { type TDb } from '../../db';
import { productFiles } from '../../db/schema';
import { type IProductFileRecord, type IProductFileRepository } from '../interfaces';

export class ProductFileRepository implements IProductFileRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: { productId: number; fileId: number }): Promise<IProductFileRecord> {
        const [row] = await this.dbWrite.insert(productFiles).values(input).returning();
        return {
            id: row.id,
            productId: row.productId,
            fileId: row.fileId,
        };
    }
}
