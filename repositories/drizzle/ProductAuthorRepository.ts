import { type TDb } from '../../db';
import { productAuthors } from '../../db/schema';
import {
    type IProductAuthorCreateInput,
    type IProductAuthorRecord,
    type IProductAuthorRepository,
} from '../interfaces';

export class ProductAuthorRepository implements IProductAuthorRepository {
    constructor(private readonly dbWrite: TDb) {}

    async create(input: IProductAuthorCreateInput): Promise<IProductAuthorRecord> {
        const [row] = await this.dbWrite.insert(productAuthors).values(input).returning();
        return row;
    }
}
