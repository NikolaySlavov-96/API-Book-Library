const https = require('https');
const fs = require('fs');
require('dotenv').config();

const express = require('express');

const useExpress = require('./config/useExpress');
const router = require('./config/router');
const PORT = process.env.PORT;

/*
const options = {
    key: fs.readFileSync('../key-PRK.pem'),
    cert: fs.readFileSync('../cert-CRT.pem')
}
*/


start();

async function start() {
    const app = express();

    // https.createServer(options, app).listen(PORT, () => console.log('Server work on port ' + PORT));

    useExpress(app, express);
    router(app);

    app.listen(PORT, () => console.log('Application works'))
}
