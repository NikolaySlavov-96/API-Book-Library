import { createClient, } from 'redis';

const { REDIS_ADDRESS, REDIS_PORT, } = process.env;

const redisClient = createClient({ url: `redis://${REDIS_ADDRESS}:${REDIS_PORT}` });

redisClient.on('error', (err) => {
    console.error('Redis client error', err);
});

export default redisClient;