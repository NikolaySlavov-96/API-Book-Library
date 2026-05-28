import { relations } from 'drizzle-orm';
import { integer, pgTable, serial, varchar } from 'drizzle-orm/pg-core';

import { TABLE_NAMES } from './tableNames';
import { users } from './user';

export const sessions = pgTable(TABLE_NAMES.SESSION, {
    id: serial('id').primaryKey(),
    connectId: varchar('connectId', { length: 50 }).unique(),
    userId: integer('userId').references(() => users.id, { onDelete: 'set null' }),
    connectedAt: varchar('connectedAt'),
    disconnectedAt: varchar('disconnectedAt'),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
    user: one(users, {
        fields: [sessions.userId],
        references: [users.id],
    }),
}));

export type TSessionRow = typeof sessions.$inferSelect;
export type TSessionInsert = typeof sessions.$inferInsert;
