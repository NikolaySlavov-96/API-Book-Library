import { createClient, } from 'redis';

const { REDIS_ADDRESS, REDIS_PORT, } = process.env;

const redisClient = createClient({ url: `redis://${REDIS_ADDRESS}:${REDIS_PORT}`, });

redisClient.on('error', (err) => {
    console.error('Redis client error', err);
});

// TODO Research
// redisClient.connect().then(() => {
//     console.log('Connected to Redis');
// });

export default redisClient;