require('dotenv').config();
const db = require('pg').Pool;


const dbConnect = new db({
    user: process.env.DB_USER,
    host: process.env.DB_ADDRESS,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

module.exports = { dbConnect };