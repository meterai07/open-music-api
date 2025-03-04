const pool = require('../postgres');

const addRefreshToken = async (token) => {
    const query = {
        text: 'INSERT INTO authentications(token) VALUES($1)',
        values: [token],
    };
    await pool.query(query);
};

const verifyRefreshToken = async (token) => {
    const query = {
        text: 'SELECT token FROM authentications WHERE token = $1',
        values: [token],
    };
    const result = await pool.query(query);

    if (!result.rows.length) {
        throw new Error('Refresh token tidak valid');
    }
};

const deleteRefreshToken = async (token) => {
    const query = {
        text: 'DELETE FROM authentications WHERE token = $1',
        values: [token],
    };
    await pool.query(query);
};

module.exports = {
    addRefreshToken,
    verifyRefreshToken,
    deleteRefreshToken,
};