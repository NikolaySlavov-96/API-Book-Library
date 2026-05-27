import { and, avg, count, eq } from 'drizzle-orm';

import { type TDb } from '../../db';
import { productRatings } from '../../db/schema';
import {
    type TProductRatingCreateInput,
    type TProductRatingRecord,
    type TProductRatingRepository,
    type TRatingAggregate,
} from '../types';

export class ProductRatingRepository implements TProductRatingRepository {
    constructor(
        private readonly dbRead: TDb,
        private readonly dbWrite: TDb,
    ) {}

    async findByUserAndProduct(userId: number, productId: number): Promise<TProductRatingRecord | null> {
        const [row] = await this.dbRead
            .select()
            .from(productRatings)
            .where(and(eq(productRatings.userId, userId), eq(productRatings.productId, productId)))
            .limit(1);
        return row ?? null;
    }

    async upsert(input: TProductRatingCreateInput): Promise<TProductRatingRecord> {
        const [row] = await this.dbWrite
            .insert(productRatings)
            .values(input)
            .onConflictDoUpdate({
                target: [productRatings.userId, productRatings.productId],
                set: { rating: input.rating, updatedAt: new Date() },
            })
            .returning();
        return row;
    }

    async getAggregate(productId: number): Promise<TRatingAggregate> {
        const [row] = await this.dbRead
            .select({
                average: avg(productRatings.rating),
                count: count(productRatings.rating),
            })
            .from(productRatings)
            .where(eq(productRatings.productId, productId));

        const rawAverage = row?.average;
        const numericAverage = rawAverage ? Number(rawAverage) : 0;
        const rawCount = Number(row?.count ?? 0);

        return {
            average: numericAverage ? Number(numericAverage.toFixed(2)) : 0,
            count: rawCount,
        };
    }

    async getUserRating(userId: number, productId: number): Promise<number> {
        const [row] = await this.dbRead
            .select({ rating: productRatings.rating })
            .from(productRatings)
            .where(and(eq(productRatings.userId, userId), eq(productRatings.productId, productId)))
            .limit(1);
        return row?.rating ?? 0;
    }
}
