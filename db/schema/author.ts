import { relations } from 'drizzle-orm';
import { boolean, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { authorFiles } from './authorFile';
import { productAuthors } from './productAuthor';
import { TABLE_NAMES } from './tableNames';

export const authors = pgTable(TABLE_NAMES.AUTHOR, {
    id: serial('id').primaryKey(),
    name: varchar('name', { length: 60 }),
    genre: varchar('genre', { length: 45 }),
    isVerify: boolean('isVerify').default(false).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const authorsRelations = relations(authors, ({ many }) => ({
    productAuthors: many(productAuthors),
    authorFiles: many(authorFiles),
}));

export type TAuthorRow = typeof authors.$inferSelect;
export type TAuthorInsert = typeof authors.$inferInsert;
