const pool = require('../postgres');

const addPlaylist = async (playlist) => {
    const { name, owner } = playlist;
    
    const id = `playlist-${Math.random().toString(36).substr(2, 16)}`;
    
    const query = {
        text: 'INSERT INTO playlists(id, name, owner) VALUES($1, $2, $3) RETURNING id',
        values: [id, name, owner]
    };

    const result = await pool.query(query);
    
    return result.rows[0].id;
}

const getPlaylists = async (owner) => {    
    const query = {
        text: 'SELECT * FROM playlists WHERE owner = $1',
        values: [owner]
    };

    const result = await pool.query(query);  

    return result.rows;
}

const deletePlaylistById = async (id) => {
    const query = {
        text: 'DELETE FROM playlists WHERE id = $1',
        values: [id]
    };

    await pool.query(query);
}

module.exports = { addPlaylist, getPlaylists, deletePlaylistById };