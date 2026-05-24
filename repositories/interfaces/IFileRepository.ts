import { type TFileRow } from '../../db/schema';

export type IFileRecord = TFileRow;

export type IFileCreateInput = Pick<TFileRow, 'extension' | 'realFileName' | 'src' | 'uniqueName'>;

export interface IFileRepository {
    create(input: IFileCreateInput): Promise<IFileRecord>;
    findById(id: number): Promise<IFileRecord | null>;
    deleteById(id: number): Promise<void>;
}
