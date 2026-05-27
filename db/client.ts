import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import 'dotenv/config';

import { createLogger } from '../Helpers';

import * as schema from './schema';

const log = createLogger('db');

const { Client, Pool } = pg;

const { DATABASE_READ_URL, DATABASE_WRITE_URL, P_DB_ADDRESS, P_DB_PORT, P_DB_NAME, P_DB_USER, P_DB_PASSWORD } =
    process.env;

const READ_CONNECTION_STRING = DATABASE_READ_URL;
const WRITE_CONNECTION_STRING = DATABASE_WRITE_URL;

const readPool = new Pool({ connectionString: READ_CONNECTION_STRING });
const writePool = new Pool({ connectionString: WRITE_CONNECTION_STRING });

export type TSchema = typeof schema;
export type TDb = NodePgDatabase<TSchema>;

export const dbRead: TDb = drizzle(readPool, { schema });
export const dbWrite: TDb = drizzle(writePool, { schema });

export const ensureDatabaseExists = async (): Promise<void> => {
    const dbName = P_DB_NAME;
    if (!dbName) {
        return;
    }

    const adminClient = new Client({
        host: P_DB_ADDRESS,
        port: Number(P_DB_PORT),
        user: P_DB_USER,
        password: P_DB_PASSWORD,
        database: 'postgres',
    });

    try {
        await adminClient.connect();
        const res = await adminClient.query('SELECT datname FROM pg_catalog.pg_database WHERE datname = $1', [dbName]);
        if (res.rowCount === 0) {
            await adminClient.query(`CREATE DATABASE "${dbName}";`);
        }
    } catch (err) {
        log.error('Error creating database: ', err);
    } finally {
        await adminClient.end();
    }
};

export const verifyDatabaseConnections = async (): Promise<void> => {
    await readPool.query('SELECT 1');
    await writePool.query('SELECT 1');
};

export const closeDatabaseConnections = async (): Promise<void> => {
    await readPool.end();
    await writePool.end();
};
