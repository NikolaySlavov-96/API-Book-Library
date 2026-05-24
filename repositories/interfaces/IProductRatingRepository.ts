import { type TProductRatingRow } from '../../db/schema';

export type IProductRatingRecord = TProductRatingRow;

export type IProductRatingCreateInput = Pick<TProductRatingRow, 'userId' | 'productId' | 'rating'>;

export interface IRatingAggregate {
    average: number;
    count: number;
}

export interface IProductRatingRepository {
    findByUserAndProduct(userId: number, productId: number): Promise<IProductRatingRecord | null>;
    upsert(input: IProductRatingCreateInput): Promise<IProductRatingRecord>;
    getAggregate(productId: number): Promise<IRatingAggregate>;
    getUserRating(userId: number, productId: number): Promise<number>;
}
