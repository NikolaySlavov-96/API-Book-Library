import { type TProductFileRow } from '../../db/schema';

export type TProductFileRecord = TProductFileRow;

export type TProductFileCreateInput = Pick<TProductFileRow, 'productId' | 'fileId'>;

export type TProductFileRepository = {
    create(input: TProductFileCreateInput): Promise<TProductFileRecord>;
};
