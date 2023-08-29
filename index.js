const express = require('express');

const useExpress = require('./config/useExpress');
const router = require('./config/router');

start();

async function start() {
    const app = express();

    useExpress(app, express);
    router(app);

    app.listen(3000, () => console.log('Application works'))
}
