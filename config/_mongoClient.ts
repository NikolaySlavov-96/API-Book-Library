import { connect } from 'mongoose';

import 'dotenv/config';

import { createLogger } from '../Helpers';

const log = createLogger('mongoClient');

const { M_DB_ADDRESS, M_DB_PORT, M_DB_NAME } = process.env;

const mongoURL = `mongodb://${M_DB_ADDRESS}:${M_DB_PORT}/${M_DB_NAME}`;

const mongoClient = async () => {
    try {
        await connect(mongoURL);
    } catch (err) {
        log.error('Mongo connect error', err);
    }
};

export default mongoClient;
