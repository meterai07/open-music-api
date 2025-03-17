const fs = require('fs');
const path = require('path');
const pool = require('../../database/postgres');
const messages = require('../../utils/const/message');
const status_code = require('../../utils/const/status_code');
const { GetAlbumById } = require('../../database/services/AlbumServices');
const { successResponse, errorResponse, putDeleteResponse } = require('../../utils/response');
const { getCache, setCache, deleteCache } = require('../../database/services/RedisServices');

const postAlbumHandler = async (request, h) => {
  try {
    const { name, year } = request.payload;
    const id = `album-${Math.random().toString(36).substring(2, 16)}`;

    await pool.query(
      'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3)',
      [id, name, year],
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

    const songsResult = await pool.query('SELECT id, title, performer FROM songs WHERE album_id = $1', [id]);

    const album = albumResult.rows[0];
    const formattedAlbum = {
      id: album.id,
      name: album.name,
      year: album.year,
      coverUrl: album.cover_url || null,
      songs: songsResult.rows,
    };

    return successResponse(h, {
      album: formattedAlbum,
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
      [name, year, id],
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
    const { cover } = request.payload;

    const album = await GetAlbumById(id);

    if (!album) {
      return errorResponse(h, messages.ALBUM_NOT_FOUND, status_code.NOT_FOUND);
    }

    if (!cover) {
      return errorResponse(h, messages.ALBUM_COVER_REQUIRED, status_code.BAD_REQUEST);
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedMimeTypes.includes(cover.hapi.headers['content-type'])) {
      return errorResponse(h, messages.INVALID_FILE_TYPE, status_code.BAD_REQUEST);
    }

    const uploadDir = path.join(__dirname, '../uploads/pictures');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    if (album.cover_url) {
      const oldCoverPath = path.join(__dirname, '../uploads/pictures', path.basename(album.cover_url));
      if (fs.existsSync(oldCoverPath)) {
        fs.unlinkSync(oldCoverPath);
      }
    }

    const filename = `${id}_${Date.now()}_${cover.hapi.filename}`;
    const filePath = path.join(uploadDir, filename);

    const fileStream = fs.createWriteStream(filePath);
    await new Promise((resolve, reject) => {
      cover.pipe(fileStream);
      cover.on('end', resolve);
      cover.on('error', reject);
    });

    const host = process.env.HOST || 'localhost';
    const port = process.env.PORT || 5000;
    const coverUrl = `http://${host}:${port}/uploads/pictures/${filename}`;

    await pool.query('UPDATE albums SET cover_url = $1 WHERE id = $2', [coverUrl, id]);

    return putDeleteResponse(h, messages.ALBUM_COVER_UPLOADED, status_code.CREATED);
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
      [id, userId],
    );

    if (likeResult.rows.length) {
      return errorResponse(h, messages.ALBUM_ALREADY_LIKED, status_code.BAD_REQUEST);
    }

    const likeId = `like-${Math.random().toString(36).substring(2, 16)}`;

    await pool.query(
      'INSERT INTO likes (id, album_id, user_id) VALUES ($1, $2, $3)',
      [likeId, id, userId],
    );

    await deleteCache(id);

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
      [id, userId],
    );

    if (!result.rows.length) {
      return errorResponse(h, messages.ALBUM_FAILED_TO_UPDATE, status_code.NOT_FOUND);
    }

    await deleteCache(id);

    return putDeleteResponse(h, messages.ALBUM_UPDATED, status_code.SUCCESS);
  } catch (error) {
    return errorResponse(h, error.message, status_code.ERROR);
  }
};

const getLikeAlbumHandler = async (request, h) => {
  try {
    const { id } = request.params;

    const cachedKey = await getCache(id);
    if (cachedKey) {
      return successResponse(h, { likes: cachedKey }).header('X-Data-Source', 'cache');
    }

    const result = await pool.query('SELECT COUNT(*) AS like_count FROM likes WHERE album_id = $1', [id]);
    const likeCount = parseInt(result.rows[0].like_count, 10);

    await setCache(id, likeCount, 1800);

    return successResponse(h, { likes: likeCount }).header('X-Data-Source', 'database');
  } catch (error) {
    return errorResponse(h, error.message, status_code.ERROR);
  }
};

module.exports = {
  postAlbumHandler,
  getAlbumByIdHandler,
  putAlbumByIdHandler,
  deleteAlbumByIdHandler,
  postAlbumCoverHandler,
  postLikeAlbumHandler,
  deleteLikeAlbumHandler,
  getLikeAlbumHandler,
};
