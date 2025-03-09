const pool = require('../../database/postgres');
const messages = require('../../utils/const/message');
const status_code = require('../../utils/const/status_code');
const { successResponse, errorResponse, putDeleteResponse } = require('../../utils/response');

const postAlbumHandler = async (request, h) => {
    try {
        const { name, year } = request.payload;
        const id = `album-${Math.random().toString(36).substring(2, 16)}`;

        await pool.query(
            'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3)',
            [id, name, year]
        );

        return successResponse(h, { albumId: id }, status_code.CREATED);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

const getAlbumByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const albumResult = await pool.query('SELECT * FROM albums WHERE id = $1', [id]);

        if (!albumResult.rows.length) {
            return errorResponse(h, messages.ALBUM_NOT_FOUND, status_code.NOT_FOUND);
        }

        const songsResult = await pool.query('SELECT * FROM songs WHERE album_id = $1', [id]);

        return successResponse(h, { 
            album: {
                ...albumResult.rows[0],
                songs: songsResult.rows
            }
        });
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

const putAlbumByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const { name, year } = request.payload;

        const result = await pool.query(
            'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
            [name, year, id]
        );

        if (!result.rows.length) {
            return errorResponse(h, messages.ALBUM_FAILED_TO_UPDATE, status_code.NOT_FOUND);
        }

        return putDeleteResponse(h, messages.ALBUM_UPDATED, status_code.SUCCESS);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

const deleteAlbumByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const result = await pool.query('DELETE FROM albums WHERE id = $1 RETURNING id', [id]);

        if (!result.rows.length) {
            return errorResponse(h, messages.ALBUM_FAILED_TO_UPDATE, status_code.NOT_FOUND);
        }

        return putDeleteResponse(h, messages.ACTIVITIES_DELETE, status_code.SUCCESS);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

module.exports = { postAlbumHandler, getAlbumByIdHandler, putAlbumByIdHandler, deleteAlbumByIdHandler };