const db = require('pg').Pool;

const dbConnect = new db({
    user: 'postgres',
    host: '192.168.88.51',
    database: 'booklibrary',
    password: '5566',
    port: '5433'
});

module.exports = { dbConnect };