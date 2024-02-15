require('dotenv').config();
const express = require('express');

const useExpress = require('./config/useExpress');
const router = require('./config/router');
const PORT = process.env.PORT;


start();

async function start() {
    const app = express();

    useExpress(app, express);
    router(app);

    // app.listen()
    app.listen(PORT, () => console.log('Application works'))
}
