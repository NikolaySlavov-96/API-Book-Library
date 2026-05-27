import { type TProductRatingRow } from '../../db/schema';

export type TProductRatingRecord = TProductRatingRow;

export type TProductRatingCreateInput = Pick<TProductRatingRow, 'userId' | 'productId' | 'rating'>;

export type TRatingAggregate = {
    average: number;
    count: number;
};

export type TProductRatingRepository = {
    findByUserAndProduct(userId: number, productId: number): Promise<TProductRatingRecord | null>;
    upsert(input: TProductRatingCreateInput): Promise<TProductRatingRecord>;
    getAggregate(productId: number): Promise<TRatingAggregate>;
    getUserRating(userId: number, productId: number): Promise<number>;
};
