import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, uniqueIndex } from 'drizzle-orm/pg-core';

import { authors } from './author';
import { products } from './product';
import { TABLE_NAMES } from './tableNames';

export const productAuthors = pgTable(
    TABLE_NAMES.PRODUCT_AUTHOR,
    {
        id: serial('id').primaryKey(),
        productId: integer('productId').notNull(),
        authorId: integer('authorId').notNull(),
    },
    (table) => ({
        productAuthorUnique: uniqueIndex('productAuthor_productId_authorId').on(table.productId, table.authorId),
    }),
);

export const productAuthorsRelations = relations(productAuthors, ({ one }) => ({
    product: one(products, {
        fields: [productAuthors.productId],
        references: [products.id],
    }),
    author: one(authors, {
        fields: [productAuthors.authorId],
        references: [authors.id],
    }),
}));

export type TProductAuthorRow = typeof productAuthors.$inferSelect;
export type TProductAuthorInsert = typeof productAuthors.$inferInsert;
