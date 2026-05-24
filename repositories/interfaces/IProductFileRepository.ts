export interface IProductFileRecord {
    id: number;
    productId: number;
    fileId: number;
}

export interface IProductFileRepository {
    create(input: { productId: number; fileId: number }): Promise<IProductFileRecord>;
}
