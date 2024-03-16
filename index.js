require('dotenv').config();
const express = require('express');

const { checkDatabaseIfItExist, db } = require('./config/database');
const useExpress = require('./config/useExpress');
const router = require('./config/router');

const PORT = process.env.PORT;


start();

async function start() {
    await checkDatabaseIfItExist();
    await db.sequelize.sync();

    const app = express();

    useExpress(app, express);
    router(app);

    // app.listen()
    app.listen(PORT, () => console.log('Application works'))
}
