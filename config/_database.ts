import 'dotenv/config';
import { Client, } from 'pg';
import { Sequelize, } from 'sequelize';

// Constants for login
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_ADDRESS = process.env.DB_ADDRESS;
const DB_PORT = Number(process.env.DB_PORT);
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

const sequelize = new Sequelize(
    DB_NAME as string,
    DB_USER as string,
    DB_PASSWORD as string,
    {
        host: DB_ADDRESS,
        port: DB_PORT,
        dialect: DIALECT as 'postgres',
    }
);

export default sequelize;