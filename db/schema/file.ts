import { relations } from 'drizzle-orm';
import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { authorFiles } from './authorFile';
import { productFiles } from './productFile';
import { TABLE_NAMES } from './tableNames';

export const files = pgTable(TABLE_NAMES.FILE, {
    id: serial('id').primaryKey(),
    extension: varchar('extension', { length: 10 }),
    realFileName: varchar('realFileName', { length: 60 }),
    src: varchar('src', { length: 120 }),
    uniqueName: varchar('uniqueName', { length: 145 }),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const filesRelations = relations(files, ({ many }) => ({
    productFiles: many(productFiles),
    authorFiles: many(authorFiles),
}));

export type TFileRow = typeof files.$inferSelect;
export type TFileInsert = typeof files.$inferInsert;
