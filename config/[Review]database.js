require('dotenv').config();
const { Client, } = require('pg');
const { Sequelize, } = require('sequelize');


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
            console.log(`${DB_NAME}`);
            await client.query(`CREATE DATABASE "${DB_NAME}";`);
        }
    } catch (err) {
        console.error('Error creating database: ', err);
    } finally {
        await client.end();
    }
};

// const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
//   host: dbConfig.HOST,
//   dialect: dbConfig.dialect,
//   operatorsAliases: false,

//   pool: {
//     max: dbConfig.pool.max,
//     min: dbConfig.pool.min,
//     acquire: dbConfig.pool.acquire,
//     idle: dbConfig.pool.idle
//   }
// });

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

const dbConnect = async (app) => {
    // Creating DB Without Exist
    await checkDatabaseIfItExist();

    const db = {};

    db.Sequelize = Sequelize;
    db.sequelize = sequelize;

    db.users = require('../Model/AuthorMode')(sequelize, Sequelize);
    db.users = require('../Model/BookModel')(sequelize, Sequelize);
    db.users = require('../Model/BookStateModel')(sequelize, Sequelize);
    db.users = require('../Model/UserModel')(sequelize, Sequelize);

    sequelize.sync();
    //sequelize.authenticate();

    return db;
};

module.exports = {
    dbConnect,
};


// // models/Category.js
// const Sequelize = require("sequelize");
// module.exports = function createUserModel(sequelize) {
//     const Category = sequelize.define(
//         "Category",
//         {
//             name: { type: Sequelize.STRING, allowNull: false }
//         },
//         {}
//     );
//     // Category.associate = ({ Article, ArticleCategories }) =>
//     //   Category.belongsToMany(Article, {
//     //     as: "articles",
//     //     through: ArticleCategories,
//     //     foreignKey: "categoryName"
//     //  });
//     return Category;
// };