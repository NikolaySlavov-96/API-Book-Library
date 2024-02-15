require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_ADDRESS,
        port: process.env.DB_PORT,
        dialect: 'postgres'
    }
);

const dbConnect = async (app) => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        // process.exit(1);
    }
}

module.exports = {
    dbConnect,
    sequelize,
}