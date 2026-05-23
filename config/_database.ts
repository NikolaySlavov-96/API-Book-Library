import { Client } from 'pg';
import { Sequelize } from 'sequelize';

import 'dotenv/config';

// Constants for login
const DB_NAME = process.env.P_DB_NAME;
const DB_USER = process.env.P_DB_USER;
const DB_PASSWORD = process.env.P_DB_PASSWORD;
const DB_ADDRESS = process.env.P_DB_ADDRESS;
const DB_PORT = Number(process.env.P_DB_PORT);
const DIALECT = 'postgres';

// Function for create DB if it doesn't exits
export const _checkDatabaseIfItExist = async () => {
    const client = new Client({
        user: DB_USER,
        password: DB_PASSWORD,
        host: DB_ADDRESS,
        port: DB_PORT,
        database: 'postgres',
    });

    try {
        await client.connect();
        const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${DB_NAME}'`);
        if (res.rowCount === 0) {
            await client.query(`CREATE DATABASE "${DB_NAME}";`);
        }
    } catch (err) {
        console.error('Error creating database: ', err);
    } finally {
        await client.end();
    }
};

export default () => {
    const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
        host: DB_ADDRESS,
        port: DB_PORT,
        dialect: DIALECT as 'postgres',
    });

    return sequelize;
};
