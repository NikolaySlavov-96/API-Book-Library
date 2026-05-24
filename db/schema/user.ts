import { relations } from 'drizzle-orm';
import { boolean, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

import { productRatings } from './productRating';
import { productStatuses } from './productStatus';
import { profiles } from './profile';
import { sessions } from './session';
import { TABLE_NAMES } from './tableNames';

export const users = pgTable(TABLE_NAMES.USER, {
    id: serial('id').primaryKey(),
    email: varchar('email', { length: 80 }).notNull().unique(),
    password: varchar('password', { length: 60 }),
    isVerify: boolean('isVerify').default(false).notNull(),
    isDelete: boolean('isDelete').default(false).notNull(),
    role: varchar('role', { length: 20 }).default('user').notNull(),
    createdAt: timestamp('createdAt', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updatedAt', { withTimezone: true }).defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ one, many }) => ({
    profile: one(profiles, {
        fields: [users.id],
        references: [profiles.userId],
    }),
    session: one(sessions, {
        fields: [users.id],
        references: [sessions.userId],
    }),
    productStatuses: many(productStatuses),
    productRatings: many(productRatings),
}));

export type TUserRow = typeof users.$inferSelect;
export type TUserInsert = typeof users.$inferInsert;
