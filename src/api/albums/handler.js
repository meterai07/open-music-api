const pool = require('../../database/postgres');
const messages = require('../../utils/const/message');
const status_code = require('../../utils/const/status_code');
const { getAlbumById } = require('../../database/services/AlbumServices');
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

const postAlbumCoverHandler = async (request, h) => {
    try {
        const { id } = request.params;
        console.log(request.payload);
        
        const { cover } = request.payload.cover;
        
        const album = await getAlbumById(id);

        if (!album) {
            return errorResponse(h, messages.ALBUM_NOT_FOUND, status_code.NOT_FOUND);
        }

        if (!cover) {
            return errorResponse(h, messages.ALBUM_COVER_REQUIRED, status_code.BAD_REQUEST);
        }

        if (process.env.USE_AWS_S3){

        } else {

        }

        // const result = await pool.query(
        //     'UPDATE albums SET picture = $1 WHERE id = $2 RETURNING id',
        //     [file.hapi.filename, id]
        // );

        // if (!result.rows.length) {
        //     return errorResponse(h, messages.ALBUM_FAILED_TO_UPDATE, status_code.NOT_FOUND);
        // }

        // return putDeleteResponse(h, messages.ALBUM_UPDATED, status_code.SUCCESS);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

const postLikeAlbumHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const userId = request.auth.credentials.id;

        const albumResult = await pool.query('SELECT * FROM albums WHERE id = $1', [id]);

        if (!albumResult.rows.length) {
            return errorResponse(h, messages.ALBUM_NOT_FOUND, status_code.NOT_FOUND);
        }

        const likeResult = await pool.query(
            'SELECT * FROM likes WHERE album_id = $1 AND user_id = $2',
            [id, userId]
        );

        if (likeResult.rows.length) {
            return errorResponse(h, messages.ALBUM_ALREADY_LIKED, status_code.BAD_REQUEST);
        }

        const likeId = `like-${Math.random().toString(36).substring(2, 16)}`;

        await pool.query(
            'INSERT INTO likes (id, album_id, user_id) VALUES ($1, $2, $3)',
            [likeId, id, userId]
        );

        return putDeleteResponse(h, messages.ALBUM_LIKED, status_code.CREATED);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

const deleteLikeAlbumHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const userId = request.auth.credentials.id;

        const result = await pool.query(
            'DELETE FROM likes WHERE album_id = $1 AND user_id = $2 RETURNING id',
            [id, userId]
        );

        if (!result.rows.length) {
            return errorResponse(h, messages.ALBUM_FAILED_TO_UPDATE, status_code.NOT_FOUND);
        }

        return putDeleteResponse(h, messages.ALBUM_UPDATED, status_code.SUCCESS);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

const getLikeAlbumHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const result = await pool.query('SELECT * FROM likes WHERE album_id = $1', [id]);

        return successResponse(h, { likes: result.rows });
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

module.exports = { postAlbumHandler, getAlbumByIdHandler, putAlbumByIdHandler, deleteAlbumByIdHandler, postAlbumCoverHandler, postLikeAlbumHandler, deleteLikeAlbumHandler, getLikeAlbumHandler };