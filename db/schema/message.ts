import { relations } from 'drizzle-orm';
import { boolean, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { messageStatuses } from './messageStatus';
import { sessions } from './session';
import { TABLE_NAMES } from './tableNames';

export const messages = pgTable(TABLE_NAMES.MESSAGE, {
    id: serial('id').primaryKey(),
    roomName: varchar('roomName', { length: 30 }).notNull(),
    senderId: varchar('senderId', { length: 50 }).notNull(),
    message: varchar('message', { length: 255 }),
    isDelete: boolean('isDelete').default(false).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one, many }) => ({
    session: one(sessions, {
        fields: [messages.senderId],
        references: [sessions.connectId],
    }),
    statuses: many(messageStatuses),
}));

export type TMessageRow = typeof messages.$inferSelect;
export type TMessageInsert = typeof messages.$inferInsert;
