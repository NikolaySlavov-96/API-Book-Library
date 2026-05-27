import { type TAuthorFileRow } from '../../db/schema';

export type TAuthorFileRecord = TAuthorFileRow;

export type TAuthorFileCreateInput = Pick<TAuthorFileRow, 'authorId' | 'fileId'>;

export type TAuthorFileRepository = {
    create(input: TAuthorFileCreateInput): Promise<TAuthorFileRecord>;
};
