const pool = require('../postgres');

const getPlaylistActivities = async (playlistId) => {
    const query = {
        text: `SELECT users.username, songs.title, activities.action, activities.time FROM activities
        JOIN users ON activities.user_id = users.id
        JOIN songs ON activities.song_id = songs.id
        WHERE activities.playlist_id = $1
        ORDER BY activities.time ASC`,
        values: [playlistId],
    };

    const result = await pool.query(query);
    return result.rows;
};

const addPlaylistActivity = async (activity) => {
    const { userId, playlistId, songId, action } = activity;
    const id = `activity-${Math.random().toString(36).substring(2, 18)}`;
    const time = new Date().toISOString();
    
    const query = {
        text: 'INSERT INTO activities(id, playlist_id, user_id, song_id, action, time) VALUES($1, $2, $3, $4, $5, $6)',
        values: [id, playlistId, userId, songId, action, time]  
    };

    await pool.query(query);
};

module.exports = { getPlaylistActivities, addPlaylistActivity };