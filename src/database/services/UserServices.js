const pool = require('../postgres');
const bcrypt = require('bcrypt');
const { nanoid } = require('nanoid');

const addUser = async (user) => {
    const { username, password, fullname } = user;
    
    const id = `user-${nanoid(16)}`;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = {
        text: 'INSERT INTO users(id, username, password, fullname) VALUES($1, $2, $3, $4) RETURNING id',
        values: [id, username, hashedPassword, fullname],
    };
    const result = await pool.query(query);
    return result.rows[0].id;
};

const getUserById = async (id) => {
    const query = {
        text: 'SELECT id, username, fullname FROM users WHERE id = $1',
        values: [id],
    };

    const result = await pool.query(query);

    return result.rows[0] || null;
}

const verifyUserCredential = async (user) => {
    const { username, password } = user;    
    const query = {
        text: 'SELECT id, password FROM users WHERE username = $1',
        values: [username],
    };
    const result = await pool.query(query);
    if (!result.rows.length) {
        return null;
    }

    const { id, password: hashedPassword } = result.rows[0];
    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
        return null;
    }

    return id;
};

module.exports = { addUser, verifyUserCredential, getUserById };