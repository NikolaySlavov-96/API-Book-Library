import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, uniqueIndex } from 'drizzle-orm/pg-core';

import { authors } from './author';
import { files } from './file';
import { TABLE_NAMES } from './tableNames';

export const authorFiles = pgTable(
    TABLE_NAMES.AUTHOR_FILE,
    {
        id: serial('id').primaryKey(),
        authorId: integer('authorId')
            .notNull()
            .references(() => authors.id, { onDelete: 'cascade' }),
        fileId: integer('fileId')
            .notNull()
            .references(() => files.id, { onDelete: 'cascade' }),
    },
    (table) => ({
        authorFileUnique: uniqueIndex('authorFile_authorId_fileId').on(table.authorId, table.fileId),
    }),
);

export const authorFilesRelations = relations(authorFiles, ({ one }) => ({
    author: one(authors, {
        fields: [authorFiles.authorId],
        references: [authors.id],
    }),
    file: one(files, {
        fields: [authorFiles.fileId],
        references: [files.id],
    }),
}));

export type TAuthorFileRow = typeof authorFiles.$inferSelect;
export type TAuthorFileInsert = typeof authorFiles.$inferInsert;
