export interface IProductAuthorRecord {
    id: number;
    productId: number;
    authorId: number;
}

export interface IProductAuthorRepository {
    create(input: { productId: number; authorId: number }): Promise<IProductAuthorRecord>;
}
