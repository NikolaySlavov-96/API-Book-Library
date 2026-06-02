import { relations } from 'drizzle-orm';
import { index, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

import { products } from './product';
import { states } from './state';
import { TABLE_NAMES } from './tableNames';
import { users } from './user';

export const productStatusHistory = pgTable(
    TABLE_NAMES.PRODUCT_STATUS_HISTORY,
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
        createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => ({
        userProductIdx: index('productStatusHistory_user_product_idx').on(table.userId, table.productId),
    }),
);

export const productStatusHistoryRelations = relations(productStatusHistory, ({ one }) => ({
    user: one(users, {
        fields: [productStatusHistory.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [productStatusHistory.productId],
        references: [products.id],
    }),
    state: one(states, {
        fields: [productStatusHistory.statusId],
        references: [states.id],
    }),
}));

export type TProductStatusHistoryRow = typeof productStatusHistory.$inferSelect;
export type TProductStatusHistoryInsert = typeof productStatusHistory.$inferInsert;
