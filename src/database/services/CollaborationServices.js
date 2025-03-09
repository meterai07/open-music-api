const pool = require('../postgres');
const { nanoid } = require('nanoid');

const addCollaboration = async (playlistId, owner_id, collaborator_id) => {    
    const id = `collab-${nanoid(16)}`;

    const query = {
        text: 'INSERT INTO collaborations(id, playlist_id, owner_id, collaborator_id) VALUES($1, $2, $3, $4) RETURNING id',
        values: [id, playlistId, owner_id, collaborator_id]
    };

    const result = await pool.query(query);
    return result.rows[0].id;
};

const deleteCollaboration = async (playlistId, collaboratorId) => {
    const query = {
        text: 'DELETE FROM collaborations WHERE playlist_id = $1 AND collaborator_id = $2',
        values: [playlistId, collaboratorId] 
    };

    const result = await pool.query(query);
    return result;
};

module.exports = { addCollaboration, deleteCollaboration };