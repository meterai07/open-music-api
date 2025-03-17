const {
  postPlaylistHandler,
  getAllPlaylistsHandler,
  deletePlaylistByIdHandler,
  postSongToPlaylistHandler,
  getSongsFromPlaylistHandler,
  deleteSongFromPlaylistHandler,
  getPlaylistActivitiesHandler,
} = require('./handler');
const { playlistPayloadSchema, songsPlaylistPayloadSchema } = require('./schema');

const playlistRoutes = [
  {
    method: 'POST',
    path: '/playlists',
    handler: postPlaylistHandler,
    options: {
      validate: {
        payload: playlistPayloadSchema,
      },
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists',
    handler: getAllPlaylistsHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}',
    handler: deletePlaylistByIdHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'POST',
    path: '/playlists/{id}/songs',
    handler: postSongToPlaylistHandler,
    options: {
      validate: {
        payload: songsPlaylistPayloadSchema,
      },
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/songs',
    handler: getSongsFromPlaylistHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/playlists/{id}/songs',
    handler: deleteSongFromPlaylistHandler,
    options: {
      validate: {
        payload: songsPlaylistPayloadSchema,
      },
      auth: 'openmusic_jwt',
    },
  },
  {
    method: 'GET',
    path: '/playlists/{id}/activities',
    handler: getPlaylistActivitiesHandler,
    options: {
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = playlistRoutes;
