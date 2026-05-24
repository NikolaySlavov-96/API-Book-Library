import { defineConfig } from 'drizzle-kit';

import 'dotenv/config';

const { DATABASE_WRITE_URL } = process.env;

const connectionString = DATABASE_WRITE_URL;

export default defineConfig({
    dialect: 'postgresql',
    schema: './db/schema/*.ts',
    out: './db/migrations',
    dbCredentials: {
        url: connectionString,
    },
    verbose: true,
    strict: true,
});
