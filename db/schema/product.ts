import { relations, sql } from 'drizzle-orm';
import {
    boolean,
    integer,
    pgTable,
    serial,
    smallint,
    text,
    timestamp,
    uniqueIndex,
    varchar,
} from 'drizzle-orm/pg-core';

import { productAuthors } from './productAuthor';
import { productFiles } from './productFile';
import { productRatings } from './productRating';
import { productStatuses } from './productStatus';
import { TABLE_NAMES } from './tableNames';

export const products = pgTable(
    TABLE_NAMES.PRODUCT,
    {
        id: serial('id').primaryKey(),
        productTitle: varchar('productTitle', { length: 140 }),
        genre: varchar('genre', { length: 45 }),
        isVerify: boolean('isVerify').default(false).notNull(),
        pages: integer('pages'),
        publishedYear: smallint('publishedYear'),
        description: text('description'),
        authorsSeparator: varchar('authorsSeparator', { length: 8 }).default(',').notNull(),
        createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => ({
        productTitleUniqueIdx: uniqueIndex('productTitle').on(sql`lower(${table.productTitle})`),
    }),
);

export const productsRelations = relations(products, ({ many }) => ({
    productStatuses: many(productStatuses),
    productRatings: many(productRatings),
    productAuthors: many(productAuthors),
    productFiles: many(productFiles),
}));

export type TProductRow = typeof products.$inferSelect;
export type TProductInsert = typeof products.$inferInsert;
