import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

import { messageStatuses } from './messageStatus';
import { TABLE_NAMES } from './tableNames';
import { users } from './user';

export const messages = pgTable(TABLE_NAMES.MESSAGE, {
    id: serial('id').primaryKey(),
    roomName: varchar('roomName', { length: 64 }).notNull(),
    senderId: varchar('senderId', { length: 150 }).notNull(),
    senderUserId: integer('senderUserId').references(() => users.id, { onDelete: 'set null' }),
    message: text('message'),
    isDelete: boolean('isDelete').default(false).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const messagesRelations = relations(messages, ({ one, many }) => ({
    senderUser: one(users, {
        fields: [messages.senderUserId],
        references: [users.id],
    }),
    statuses: many(messageStatuses),
}));

export type TMessageRow = typeof messages.$inferSelect;
export type TMessageInsert = typeof messages.$inferInsert;
