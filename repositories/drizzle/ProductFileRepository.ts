import { type TDb } from '../../db';
import { productFiles } from '../../db/schema';
import { type TProductFileCreateInput, type TProductFileRecord, type TProductFileRepository } from '../types';

export class ProductFileRepository implements TProductFileRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: TProductFileCreateInput): Promise<TProductFileRecord> {
        const [row] = await this.dbWrite.insert(productFiles).values(input).returning();
        return row;
    }
}
