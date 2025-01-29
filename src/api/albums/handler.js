import { successResponse, errorResponse } from '../../utils/responses';

export const postAlbumHandler = async (request, h) => {
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