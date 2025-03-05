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


module.exports = { addUser };