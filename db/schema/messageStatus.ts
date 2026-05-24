import { relations } from 'drizzle-orm';
import { integer, pgTable, primaryKey, timestamp, varchar } from 'drizzle-orm/pg-core';

import { messages } from './message';
import { TABLE_NAMES } from './tableNames';

export const messageStatuses = pgTable(
    TABLE_NAMES.MESSAGE_STATUS,
    {
        messageId: integer('messageId').notNull(),
        status: varchar('status', { length: 20 }).notNull(),
        createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
        updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
    },
    (table) => ({
        messageStatusPk: primaryKey({ columns: [table.messageId, table.status] }),
    }),
);

export const messageStatusesRelations = relations(messageStatuses, ({ one }) => ({
    message: one(messages, {
        fields: [messageStatuses.messageId],
        references: [messages.id],
    }),
}));

export type TMessageStatusRow = typeof messageStatuses.$inferSelect;
export type TMessageStatusInsert = typeof messageStatuses.$inferInsert;
