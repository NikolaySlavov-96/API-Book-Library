import { type TProductFileRow } from '../../db/schema';

export type IProductFileRecord = TProductFileRow;

export type IProductFileCreateInput = Pick<TProductFileRow, 'productId' | 'fileId'>;

export interface IProductFileRepository {
    create(input: IProductFileCreateInput): Promise<IProductFileRecord>;
}
