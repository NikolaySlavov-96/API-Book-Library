export interface IProductRatingRecord {
    id: number;
    userId: number;
    productId: number;
    rating: number;
}

export interface IRatingAggregate {
    average: number;
    count: number;
}

export interface IProductRatingRepository {
    findByUserAndProduct(userId: number, productId: number): Promise<IProductRatingRecord | null>;
    upsert(input: { userId: number; productId: number; rating: number }): Promise<IProductRatingRecord>;
    getAggregate(productId: number): Promise<IRatingAggregate>;
    getUserRating(userId: number, productId: number): Promise<number>;
}
