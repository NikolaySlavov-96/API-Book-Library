import 'dotenv/config';
import express from 'express';

import { checkDatabaseIfItExist, database, expressConfig, router, } from './config';
import { globalErrorHandling, } from './Helpers';
import { defineAssociations } from './Model';

const PORT = process.env.PORT;

start();

async function start() {
    const app = express();

    await checkDatabaseIfItExist();

    await database.authenticate();

    defineAssociations();

    await database.sync({ force: false, });

    expressConfig(app, express);
    router(app);

    app.use(globalErrorHandling());

    app.listen(PORT, () => console.log('Application works'));
}
