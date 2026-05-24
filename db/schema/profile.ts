import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { files } from './file';
import { TABLE_NAMES } from './tableNames';
import { users } from './user';

export const profiles = pgTable(TABLE_NAMES.PROFILE, {
    id: serial('id').primaryKey(),
    userId: integer('userId').notNull().unique(),
    year: integer('year').notNull(),
    readingGoal: integer('readingGoal').default(12).notNull(),
    displayName: varchar('displayName', { length: 60 }),
    avatarFileId: integer('avatarFileId'),
    notifyByEmail: boolean('notifyByEmail').default(true).notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const profilesRelations = relations(profiles, ({ one }) => ({
    user: one(users, {
        fields: [profiles.userId],
        references: [users.id],
    }),
    avatar: one(files, {
        fields: [profiles.avatarFileId],
        references: [files.id],
    }),
}));

export type TProfileRow = typeof profiles.$inferSelect;
export type TProfileInsert = typeof profiles.$inferInsert;
