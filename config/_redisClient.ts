import { createClient } from 'redis';

import { createLogger } from '../Helpers';

const log = createLogger('redisClient');

const { REDIS_ADDRESS, REDIS_PORT } = process.env;

const redisClient = createClient({ url: `redis://${REDIS_ADDRESS}:${REDIS_PORT}` });

redisClient.on('error', (err) => {
    log.error('Redis client error', err);
});

// TODO Research
// redisClient.connect().then(() => {
//     console.log('Connected to Redis');
// });

export default redisClient;
