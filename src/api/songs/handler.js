const pool = require('../../database/postgres');
const { successResponse, errorResponse } = require('../../utils/response');

const postSongHandler = async (request, h) => {
    try {
        const { title, year, genre, performer, duration, albumId } = request.payload;
        const id = `song-${Math.random().toString(36).substr(2, 16)}`;

        await pool.query(
            `INSERT INTO songs 
      (id, title, year, genre, performer, duration, album_id) 
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [id, title, year, genre, performer, duration, albumId]
        );

        return successResponse(h, { songId: id }, 201);
    } catch (error) {
        if (error.code === '23503') { // Foreign key violation
            return errorResponse(h, 'Album tidak ditemukan', 400);
        }
        return errorResponse(h, error.message, 500);
    }
};

const getSongsHandler = async (request, h) => {
    try {
        const { title, performer } = request.query;
        let query = 'SELECT id, title, performer FROM songs';
        const values = [];
        const conditions = [];

        if (title) {
            conditions.push(`title ILIKE $${conditions.length + 1}`);
            values.push(`%${title}%`);
        }

        if (performer) {
            conditions.push(`performer ILIKE $${conditions.length + 1}`);
            values.push(`%${performer}%`);
        }

        if (conditions.length > 0) {
            query += ` WHERE ${conditions.join(' AND ')}`;
        }

        const result = await pool.query(query, values);
        return successResponse(h, { songs: result.rows });
    } catch (error) {
        return errorResponse(h, error.message, 500);
    }
};

const getSongByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const result = await pool.query(
            `SELECT id, title, year, genre, performer, duration, album_id as "albumId" 
      FROM songs WHERE id = $1`,
            [id]
        );

        if (!result.rows.length) {
            return errorResponse(h, 'Lagu tidak ditemukan', 404);
        }

        return successResponse(h, { song: result.rows[0] });
    } catch (error) {
        return errorResponse(h, error.message, 500);
    }
};

const putSongByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const { title, year, genre, performer, duration, albumId } = request.payload;

        const result = await pool.query(
            `UPDATE songs SET
      title = $1, year = $2, genre = $3, 
      performer = $4, duration = $5, album_id = $6
      WHERE id = $7 RETURNING id`,
            [title, year, genre, performer, duration, albumId, id]
        );

        if (!result.rows.length) {
            return errorResponse(h, 'Gagal memperbarui lagu. Id tidak ditemukan', 404);
        }

        return successResponse(h, { message: 'Lagu berhasil diperbarui' });
    } catch (error) {
        if (error.code === '23503') {
            return errorResponse(h, 'Album tidak ditemukan', 400);
        }
        return errorResponse(h, error.message, 500);
    }
};

const deleteSongByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const result = await pool.query('DELETE FROM songs WHERE id = $1 RETURNING id', [id]);

        if (!result.rows.length) {
            return errorResponse(h, 'Lagu gagal dihapus. Id tidak ditemukan', 404);
        }

        return successResponse(h, { message: 'Lagu berhasil dihapus' });
    } catch (error) {
        return errorResponse(h, error.message, 500);
    }
};

module.exports = {
    postSongHandler,
    getSongsHandler,
    getSongByIdHandler,
    putSongByIdHandler,
    deleteSongByIdHandler,
    getSongsByAlbumId: async (albumId) => {
        return pool.query(
            'SELECT id, title, performer FROM songs WHERE album_id = $1',
            [albumId]
        );
    }
};