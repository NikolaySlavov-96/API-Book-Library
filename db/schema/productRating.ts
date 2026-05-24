import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, smallint, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

import { products } from './product';
import { TABLE_NAMES } from './tableNames';
import { users } from './user';

export const productRatings = pgTable(
    TABLE_NAMES.PRODUCT_RATING,
    {
        id: serial('id').primaryKey(),
        userId: integer('userId').notNull(),
        productId: integer('productId').notNull(),
        rating: smallint('rating').notNull(),
        createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => ({
        productRatingUserProductUnique: uniqueIndex('productRating_user_product').on(table.userId, table.productId),
    }),
);

export const productRatingsRelations = relations(productRatings, ({ one }) => ({
    user: one(users, {
        fields: [productRatings.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [productRatings.productId],
        references: [products.id],
    }),
}));

export type TProductRatingRow = typeof productRatings.$inferSelect;
export type TProductRatingInsert = typeof productRatings.$inferInsert;
