import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, uniqueIndex } from 'drizzle-orm/pg-core';

import { files } from './file';
import { products } from './product';
import { TABLE_NAMES } from './tableNames';

export const productFiles = pgTable(
    TABLE_NAMES.PRODUCT_FILE,
    {
        id: serial('id').primaryKey(),
        productId: integer('productId').notNull(),
        fileId: integer('fileId').notNull(),
    },
    (table) => ({
        productFileUnique: uniqueIndex('productFile_productId_fileId').on(table.productId, table.fileId),
    }),
);

export const productFilesRelations = relations(productFiles, ({ one }) => ({
    product: one(products, {
        fields: [productFiles.productId],
        references: [products.id],
    }),
    file: one(files, {
        fields: [productFiles.fileId],
        references: [files.id],
    }),
}));

export type TProductFileRow = typeof productFiles.$inferSelect;
export type TProductFileInsert = typeof productFiles.$inferInsert;
