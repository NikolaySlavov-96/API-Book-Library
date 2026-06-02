import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

import { products } from './product';
import { states } from './state';
import { TABLE_NAMES } from './tableNames';
import { users } from './user';

export const productStatusCounts = pgTable(
    TABLE_NAMES.PRODUCT_STATUS_COUNT,
    {
        id: serial('id').primaryKey(),
        userId: integer('userId')
            .notNull()
            .references(() => users.id, { onDelete: 'cascade' }),
        productId: integer('productId')
            .notNull()
            .references(() => products.id, { onDelete: 'cascade' }),
        statusId: integer('statusId')
            .notNull()
            .references(() => states.id),
        count: integer('count').default(0).notNull(),
        createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => ({
        userProductStatusUnique: uniqueIndex('productStatusCount_user_product_status_unique').on(
            table.userId,
            table.productId,
            table.statusId,
        ),
    }),
);

export const productStatusCountsRelations = relations(productStatusCounts, ({ one }) => ({
    user: one(users, {
        fields: [productStatusCounts.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [productStatusCounts.productId],
        references: [products.id],
    }),
    state: one(states, {
        fields: [productStatusCounts.statusId],
        references: [states.id],
    }),
}));

export type TProductStatusCountRow = typeof productStatusCounts.$inferSelect;
export type TProductStatusCountInsert = typeof productStatusCounts.$inferInsert;
