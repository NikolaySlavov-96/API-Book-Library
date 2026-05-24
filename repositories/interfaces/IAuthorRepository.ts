export interface IAuthorRecord {
    id: number;
    name: string | null;
    genre: string | null;
    isVerify: boolean;
}

export interface IAuthorCreateInput {
    name: string;
    genre?: string;
}

export interface IAuthorRepository {
    findByName(name: string): Promise<IAuthorRecord | null>;
    create(input: IAuthorCreateInput): Promise<IAuthorRecord>;
}
