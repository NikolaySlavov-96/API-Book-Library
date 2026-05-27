import { type TFileRow } from '../../db/schema';

export type TFileRecord = TFileRow;

export type TFileCreateInput = Pick<TFileRow, 'extension' | 'realFileName' | 'src' | 'uniqueName'>;

export type TFileRepository = {
    create(input: TFileCreateInput): Promise<TFileRecord>;
    findById(id: number): Promise<TFileRecord | null>;
    deleteById(id: number): Promise<void>;
};
