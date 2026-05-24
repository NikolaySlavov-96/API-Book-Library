import { type TAuthorFileRow } from '../../db/schema';

export type IAuthorFileRecord = TAuthorFileRow;

export type IAuthorFileCreateInput = Pick<TAuthorFileRow, 'authorId' | 'fileId'>;

export interface IAuthorFileRepository {
    create(input: IAuthorFileCreateInput): Promise<IAuthorFileRecord>;
}
