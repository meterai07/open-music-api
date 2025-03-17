const pool = require('../postgres');

const addRefreshToken = async (payload) => {
  const { token, userId } = payload;

  const id = `${userId}.${Date.now()}`;

  const query = {
    text: 'INSERT INTO authentications(id, token, user_id) VALUES($1, $2, $3)',
    values: [id, token, userId],
  };
  await pool.query(query);
};

const getRefreshTokenByToken = async (token) => {
  const query = {
    text: 'SELECT * FROM authentications WHERE token = $1',
    values: [token],
  };
  const result = await pool.query(query);

  return result.rows;
};

const deleteRefreshToken = async (token) => {
  const query = {
    text: 'DELETE FROM authentications WHERE token = $1',
    values: [token],
  };
  const result = await pool.query(query);

  if (!result.rowCount) {
    return null;
  }

  return result;
};

const getUserRefreshTokenByUserId = async (payload) => {
  const { userId } = payload;

  const query = {
    text: 'SELECT * FROM authentications WHERE user_id = $1',
    values: [userId],
  };
  const result = await pool.query(query);

  return result.rows;
};

module.exports = {
  addRefreshToken,
  getRefreshTokenByToken,
  deleteRefreshToken,
  getUserRefreshTokenByUserId,
};
