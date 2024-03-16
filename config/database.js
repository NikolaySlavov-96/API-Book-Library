require('dotenv').config();
const { Client } = require('pg');
const { Sequelize } = require('sequelize');

// Import Model
const UserModel = require("../Model/UserModel");
const AuthorModel = require("../Model/AuthorMode")
const BookModel = require("../Model/BookModel")
const BookStateModel = require("../Model/BookStateModel")


// Constants for login
const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_ADDRESS = process.env.DB_ADDRESS;
const DB_PORT = process.env.DB_PORT;
const DIALECT = 'postgres';


// Function for create DB if it doesn't exits
const checkDatabaseIfItExist = async () => {
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
}


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

const dbConnect = (app) => {
    // 
    const User = UserModel(sequelize, Sequelize);
    const Author = AuthorModel(sequelize, Sequelize);
    const Book = BookModel(sequelize, Sequelize);
    const BookState = BookStateModel(sequelize, Sequelize);

    // Creating Relationship
    BookState.belongsTo(User, { foreignKey: 'user_id' });
    BookState.belongsTo(Book, { foreignKey: 'book_id' });

    Book.belongsTo(Author, { foreignKey: 'book_id' })
    Author.belongsTo(Book, { foreignKey: 'author_book_id' });

    const db = {};

    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    // Export Models
    db.userModel = User;
    db.authorModel = Author;
    db.bookModel = Book
    db.bookStateModel = BookState;

    // sequelize.sync()
    //sequelize.authenticate();
    return db
}

const db = dbConnect();

module.exports = {
    // dbConnect,
    checkDatabaseIfItExist,
    db,
};