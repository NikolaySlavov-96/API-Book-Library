import { type TAuthorRow } from '../../db/schema';

export type IAuthorRecord = TAuthorRow;

export type IAuthorCreateInput = Pick<TAuthorRow, 'name'> & Partial<Pick<TAuthorRow, 'genre'>>;

export interface IAuthorRepository {
    findByName(name: string): Promise<IAuthorRecord | null>;
    create(input: IAuthorCreateInput): Promise<IAuthorRecord>;
}
