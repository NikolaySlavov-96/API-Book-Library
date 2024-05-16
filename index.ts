import 'dotenv/config';
import express from 'express';

import { checkDatabaseIfItExist, database, expressConfig, router, } from './config';

const PORT = process.env.PORT;


start();

async function start() {
    await checkDatabaseIfItExist();

    // const db = database();
    // await db.sequelize.sync();
    await database.sequelize.sync();

    const app = express();
    expressConfig(app, express);
    router(app);

    // app.listen()
    app.listen(PORT, () => console.log('Application works'));
}
