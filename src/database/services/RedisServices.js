const redis = require('redis');

const client = redis.createClient({
    host: process.env.REDIS_SERVER,
    port: process.env.REDIS_PORT
});

client.on('error', (error) => {
    console.error(error);
});

client.on('ready', () => {
    console.log('Redis ready');
});

client.on('connect', () => {
    console.log('Redis connected');
});

module.exports = { client };