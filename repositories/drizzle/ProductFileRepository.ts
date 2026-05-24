import { type TDb } from '../../db';
import { productFiles } from '../../db/schema';
import { type IProductFileCreateInput, type IProductFileRecord, type IProductFileRepository } from '../interfaces';

export class ProductFileRepository implements IProductFileRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: IProductFileCreateInput): Promise<IProductFileRecord> {
        const [row] = await this.dbWrite.insert(productFiles).values(input).returning();
        return row;
    }
}
