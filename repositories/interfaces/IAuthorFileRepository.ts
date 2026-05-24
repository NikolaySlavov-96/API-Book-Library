export interface IAuthorFileRecord {
    id: number;
    authorId: number;
    fileId: number;
}

export interface IAuthorFileRepository {
    create(input: { authorId: number; fileId: number }): Promise<IAuthorFileRecord>;
}
