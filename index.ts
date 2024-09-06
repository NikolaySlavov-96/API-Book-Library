import 'dotenv/config';
import express from 'express';

import { checkDatabaseIfItExist, expressConfig, router, } from './config';
import { globalErrorHandling, } from './Helpers';

import db from './Model'

const PORT = process.env.PORT;

start();

async function start() {
    const app = express();

    await checkDatabaseIfItExist();

    await db.sequelize.authenticate();

    await db.sequelize.sync({ force: false, });

    expressConfig(app, express);
    router(app);

    app.use(globalErrorHandling());

    app.listen(PORT, () => console.log('Application works'));
}
