const {
  postAlbumHandler,
  getAlbumByIdHandler,
  putAlbumByIdHandler,
  deleteAlbumByIdHandler,
  postAlbumCoverHandler,
  postLikeAlbumHandler,
  deleteLikeAlbumHandler,
  getLikeAlbumHandler,
} = require('./handler');
const { albumPayloadSchema, albumIdSchema } = require('./schema');

const albumRoutes = [
  {
    method: 'POST',
    path: '/albums',
    handler: postAlbumHandler,
    options: {
      validate: {
        payload: albumPayloadSchema,
      },
      auth: false,
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}',
    handler: getAlbumByIdHandler,
    options: {
      validate: {
        params: albumIdSchema,
      },
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/albums/{id}',
    handler: putAlbumByIdHandler,
    options: {
      validate: {
        params: albumIdSchema,
        payload: albumPayloadSchema,
      },
      auth: false,
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}',
    handler: deleteAlbumByIdHandler,
    options: {
      validate: {
        params: albumIdSchema,
      },
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/albums/{id}/covers',
    handler: postAlbumCoverHandler,
    options: {
      validate: {
        params: albumIdSchema,
      },
      payload: {
        allow: 'multipart/form-data',
        maxBytes: 512000,
        output: 'stream',
        parse: true,
      },
      auth: false,
    },
  },
  {
    method: 'POST',
    path: '/albums/{id}/likes',
    handler: postLikeAlbumHandler,
    options: {
      validate: {
        params: albumIdSchema,
      },
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/albums/{id}/likes',
    handler: deleteLikeAlbumHandler,
    options: {
      validate: {
        params: albumIdSchema,
      },
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/albums/{id}/likes',
    handler: getLikeAlbumHandler,
    options: {
      validate: {
        params: albumIdSchema,
      },
      auth: false,
    },
  },
];

module.exports = albumRoutes;
