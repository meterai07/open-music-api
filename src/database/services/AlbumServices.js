const PostAlbum = async (album) => {
    const { name, year } = album;
    const result = await pool.query(
        'INSERT INTO albums (id, name, year) VALUES ($1, $2, $3) RETURNING id',
        [nanoid(16), name, year]
    );

    return result.rows[0].id;
};

const GetAlbumById = async (id) => {
    const result = await pool.query('SELECT * FROM albums WHERE id = $1', [id]);
    return result.rows[0];
};

const PutAlbumById = async (id, album) => {
    const { name, year } = album;
    const result = await pool.query(
        'UPDATE albums SET name = $1, year = $2 WHERE id = $3 RETURNING id',
        [name, year, id]
    );

    return result.rows[0];
};

const DeleteAlbumById = async (id) => {
    const result = await pool.query('DELETE FROM albums WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
};

module.exports = { PostAlbum, GetAlbumById, PutAlbumById, DeleteAlbumById };