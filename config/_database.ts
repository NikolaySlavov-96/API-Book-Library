// @ts-nocheck
import 'dotenv/config';
import { Client, } from 'pg';
import { Sequelize, } from 'sequelize';

import {
    User as UserModel,
    Author as AuthorModel,
    Book as BookModel,
    BookState as BookStateModel,
} from '../Model';


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
    DB_NAME,
    DB_USER,
    DB_PASSWORD,
    {
        host: DB_ADDRESS,
        port: DB_PORT,
        dialect: DIALECT,
    }
);

interface IdbConnect {
    sequelize: any;
    Sequelize: any;
    userModel: any;
    authorModel: any;
    bookModel: any;
    bookStateModel: any;
}

// export default (): IdbConnect => {
const data = (): IdbConnect => {
    // 
    const User = UserModel(sequelize, Sequelize);
    const Author = AuthorModel(sequelize, Sequelize);
    const Book = BookModel(sequelize, Sequelize);
    const BookState = BookStateModel(sequelize, Sequelize);

    // Creating Relationship
    BookState.hasOne(User, { foreignKey: 'book_state_id', });
    BookState.belongsTo(User, { foreignKey: 'user_id', });
    BookState.belongsTo(Book, { foreignKey: 'book_id', });

    Book.belongsTo(Author, { foreignKey: 'book_id', });
    Author.belongsTo(Book, { foreignKey: 'author_book_id', });

    return {
        Sequelize,
        sequelize,
        userModel: User,
        authorModel: Author,
        bookModel: Book,
        bookStateModel: BookState,
    };
};

export default data();