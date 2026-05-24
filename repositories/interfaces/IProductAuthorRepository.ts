import { type TProductAuthorRow } from '../../db/schema';

export type IProductAuthorRecord = TProductAuthorRow;

export type IProductAuthorCreateInput = Pick<TProductAuthorRow, 'productId' | 'authorId'>;

export interface IProductAuthorRepository {
    create(input: IProductAuthorCreateInput): Promise<IProductAuthorRecord>;
}
