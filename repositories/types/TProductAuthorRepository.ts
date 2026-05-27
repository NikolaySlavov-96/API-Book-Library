import { type TProductAuthorRow } from '../../db/schema';

export type TProductAuthorRecord = TProductAuthorRow;

export type TProductAuthorCreateInput = Pick<TProductAuthorRow, 'productId' | 'authorId'>;

export type TProductAuthorRepository = {
    create(input: TProductAuthorCreateInput): Promise<TProductAuthorRecord>;
};
