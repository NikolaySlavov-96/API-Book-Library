import { type TAuthorRow } from '../../db/schema';

export type TAuthorRecord = TAuthorRow;

export type TAuthorCreateInput = Pick<TAuthorRow, 'name'> & Partial<Pick<TAuthorRow, 'genre'>>;

export type TAuthorRepository = {
    findByName(name: string): Promise<TAuthorRecord | null>;
    create(input: TAuthorCreateInput): Promise<TAuthorRecord>;
};
