export interface IFileRecord {
    id: number;
    extension: string | null;
    realFileName: string | null;
    src: string | null;
    uniqueName: string | null;
}

export interface IFileCreateInput {
    extension: string;
    realFileName: string;
    src: string;
    uniqueName: string;
}

export interface IFileRepository {
    create(input: IFileCreateInput): Promise<IFileRecord>;
    findById(id: number): Promise<IFileRecord | null>;
    deleteById(id: number): Promise<void>;
}
