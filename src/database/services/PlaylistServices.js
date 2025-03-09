const pool = require('../postgres');

const addPlaylist = async (playlist) => {
    const { name, owner } = playlist;

    const id = `playlist-${Math.random().toString(36).substring(2, 16)}`;

    const query = {
        text: 'INSERT INTO playlists(id, name, owner) VALUES($1, $2, $3) RETURNING id',
        values: [id, name, owner]
    };

    const result = await pool.query(query);

    return result.rows[0].id;
};

const getPlaylists = async (owner) => {
    const query = {
        text: `SELECT DISTINCT p.id, p.name, u.username
            FROM playlists p
            JOIN users u ON p.owner = u.id
            LEFT JOIN collaborations c ON p.id = c.playlist_id
            WHERE p.owner = $1 OR c.collaborator_id = $1
        `,
        values: [owner]
    };

    const result = await pool.query(query);

    return result.rows;
};

const getPlaylistDetails = async (playlistId) => {
    const query = {
        text: `SELECT p.id, p.name, p.owner, u.username, 
            ARRAY_AGG(c.collaborator_id) AS collaborators
            FROM playlists p
            JOIN users u ON p.owner = u.id
            LEFT JOIN collaborations c ON p.id = c.playlist_id
            WHERE p.id = $1
            GROUP BY p.id, p.name, p.owner, u.username;
            `,
        values: [playlistId]
    };

    const result = await pool.query(query);
    return result.rows[0];
};

const getPlaylistById = async (playlistId) => {
    const query = {
        text: `SELECT p.id, p.name, p.owner, u.username
               FROM playlists p
               JOIN users u ON p.owner = u.id
               WHERE p.id = $1`,
        values: [playlistId]
    };

    const result = await pool.query(query);
    return result.rows[0];
};


const deletePlaylistById = async (id, userId) => {
    const query = {
        text: 'DELETE FROM playlists WHERE id = $1 AND owner = $2',
        values: [id, userId]
    };

    await pool.query(query);
};

const addSongToPlaylist = async (payload) => {
    const { playlistId, songId } = payload;

    const id = `playlist_songs-${Math.random().toString(36).substring(2, 18)}`;

    const query = {
        text: 'INSERT INTO playlist_songs(id, playlist_id, song_id) VALUES($1, $2, $3)',
        values: [id, playlistId, songId]
    };

    const result = await pool.query(query);
    return result;
};

const getSongsFromPlaylist = async (playlistId) => {
    const query = {
        text: `SELECT songs.id, songs.title, songs.performer FROM songs
        JOIN playlist_songs ON songs.id = playlist_songs.song_id
        WHERE playlist_songs.playlist_id = $1`,
        values: [playlistId]
    };

    const result = await pool.query(query);
    return result.rows;
};

const deleteSongFromPlaylist = async (playlistId, songId) => {
    const query = {
        text: 'DELETE FROM playlist_songs WHERE playlist_id = $1 AND song_id = $2',
        values: [playlistId, songId]
    };

    const result = await pool.query(query);
    return result;
};

module.exports = { addPlaylist, getPlaylists, deletePlaylistById, addSongToPlaylist, getSongsFromPlaylist, deleteSongFromPlaylist, getPlaylistDetails, getPlaylistById };