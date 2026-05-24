import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, timestamp } from 'drizzle-orm/pg-core';

import { products } from './product';
import { states } from './state';
import { TABLE_NAMES } from './tableNames';
import { users } from './user';

export const productStatuses = pgTable(TABLE_NAMES.PRODUCT_STATUS, {
    id: serial('id').primaryKey(),
    userId: integer('userId').notNull(),
    productId: integer('productId').notNull(),
    statusId: integer('statusId').notNull(),
    isDelete: boolean('isDelete').default(false).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const productStatusesRelations = relations(productStatuses, ({ one }) => ({
    user: one(users, {
        fields: [productStatuses.userId],
        references: [users.id],
    }),
    product: one(products, {
        fields: [productStatuses.productId],
        references: [products.id],
    }),
    state: one(states, {
        fields: [productStatuses.statusId],
        references: [states.id],
    }),
}));

export type TProductStatusRow = typeof productStatuses.$inferSelect;
export type TProductStatusInsert = typeof productStatuses.$inferInsert;
