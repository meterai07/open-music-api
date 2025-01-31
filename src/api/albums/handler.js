const pool = require('../../database/postgres');
const { successResponse, errorResponse } = require('../../utils/response');

const postAlbumHandler = async (request, h) => {
    try {
        const { name, year } = request.payload;
        const id = `album-${Math.random().toString(36).substr(2, 16)}`;

        await pool.query(
            'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3)',
            [id, name, year]
        );

        return successResponse(h, { albumId: id }, 201);
    } catch (error) {
        return errorResponse(h, error.message, 500);
    }
};

const getAlbumByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const result = await pool.query('SELECT * FROM albums WHERE id = $1', [id]);

        if (!result.rows.length) {
            return errorResponse(h, 'Album not found', 404);
        }

        return successResponse(h, { album: result.rows[0] });
    } catch (error) {
        return errorResponse(h, error.message, 500);
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
            return errorResponse(h, 'Gagal memperbarui album. Id tidak ditemukan', 404);
        }

        return successResponse(h, { message: 'Album berhasil diperbarui' });
    } catch (error) {
        return errorResponse(h, error.message, 500);
    }
};

const deleteAlbumByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const result = await pool.query('DELETE FROM albums WHERE id = $1 RETURNING id', [id]);

        if (!result.rows.length) {
            return errorResponse(h, 'Album gagal dihapus. Id tidak ditemukan', 404);
        }

        return successResponse(h, { message: 'Album berhasil dihapus' });
    } catch (error) {
        return errorResponse(h, error.message, 500);
    }
};

module.exports = { postAlbumHandler, getAlbumByIdHandler, putAlbumByIdHandler, deleteAlbumByIdHandler };