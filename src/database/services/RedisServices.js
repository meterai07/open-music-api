const redis = require('redis');

const client = redis.createClient({
    host: process.env.REDIS_SERVER,
    port: process.env.REDIS_PORT
});

client.on('error', (error) => {
    console.error(error);
});

(async () => {
    await client.connect();
})();

// const getCache = async (key) => {
//     const result = await client.get(key);
//     return result;
// };

// const setCache = async (key, value, expirationInSec = 1800) => {
//     await client.set(key, value, {
//         EX: expirationInSec,
//     });
// };

const setCache = async (key, value, expirationInSec = 1800) => {
    await client.set(key, JSON.stringify(value), {
        EX: expirationInSec,
    });
};

const getCache = async (key) => {
    const result = await client.get(key);
    return result ? JSON.parse(result) : null;
};

const deleteCache = async (key) => {
    await client.del(key);
};

module.exports = {
    getCache,
    setCache,
    deleteCache,
};