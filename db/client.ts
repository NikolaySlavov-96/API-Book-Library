import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import 'dotenv/config';

import * as schema from './schema';

const { Pool } = pg;

const { DATABASE_READ_URL, DATABASE_WRITE_URL } = process.env;

const READ_CONNECTION_STRING = DATABASE_READ_URL;
const WRITE_CONNECTION_STRING = DATABASE_WRITE_URL;

const readPool = new Pool({ connectionString: READ_CONNECTION_STRING });
const writePool = new Pool({ connectionString: WRITE_CONNECTION_STRING });

export type TSchema = typeof schema;
export type TDb = NodePgDatabase<TSchema>;

export const dbRead: TDb = drizzle(readPool, { schema });
export const dbWrite: TDb = drizzle(writePool, { schema });

export const verifyDatabaseConnections = async (): Promise<void> => {
    await readPool.query('SELECT 1');
    await writePool.query('SELECT 1');
};

export const closeDatabaseConnections = async (): Promise<void> => {
    await readPool.end();
    await writePool.end();
};
