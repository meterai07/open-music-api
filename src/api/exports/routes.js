const { exportPayloadSchema } = require('./schema');
const { postExportPlaylistHandler } = require('./handler');

const exportRoute = [
  {
    method: 'POST',
    path: '/export/playlists/{id}',
    handler: postExportPlaylistHandler,
    options: {
      validate: {
        payload: exportPayloadSchema,
      },
      auth: 'openmusic_jwt',
    },
  },
];

module.exports = exportRoute;
