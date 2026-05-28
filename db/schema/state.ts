import { relations } from 'drizzle-orm';
import { pgTable, serial, varchar } from 'drizzle-orm/pg-core';

import { productStatuses } from './productStatus';
import { TABLE_NAMES } from './tableNames';

export const states = pgTable(TABLE_NAMES.STATE, {
    id: serial('id').primaryKey(),
    stateName: varchar('stateName', { length: 80 }).notNull().unique(),
    symbol: varchar('symbol', { length: 60 }),
});

export const statesRelations = relations(states, ({ many }) => ({
    productStatuses: many(productStatuses),
}));

export type TStateRow = typeof states.$inferSelect;
export type TStateInsert = typeof states.$inferInsert;
