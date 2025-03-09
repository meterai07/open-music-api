const pool = require('../postgres');

const getSongsById = (id) => {
    const query = {
        text: 'SELECT * FROM songs WHERE id = $1',
        values: [id]
    };

    return pool.query(query);
};

module.exports = { getSongsById };