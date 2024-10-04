import 'dotenv/config';
import { connect, } from 'mongoose';

const { M_DB_ADDRESS, M_DB_PORT, M_DB_NAME, } = process.env;

const mongoURL = `mongodb://${M_DB_ADDRESS}:${M_DB_PORT}/${M_DB_NAME}`;

const mongoClient = async () => {
    try {
        await connect(mongoURL);
    } catch (err) {
        console.error('Mongo connect error', err);
    }
};

export default mongoClient;