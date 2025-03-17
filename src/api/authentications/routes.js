const { authenticationPayloadSchema, authenticationRefreshPayloadSchema } = require('./schema');
const { authenticationPostHandler, authenticationPutHandler, authenticationDeleteHandler } = require('./handler');

const authenticationRoutes = [
  {
    method: 'POST',
    path: '/authentications',
    handler: authenticationPostHandler,
    options: {
      validate: {
        payload: authenticationPayloadSchema,
      },
      auth: false,
    },
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: authenticationPutHandler,
    options: {
      validate: {
        payload: authenticationRefreshPayloadSchema,
      },
      auth: false,
    },
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: authenticationDeleteHandler,
    options: {
      validate: {
        payload: authenticationRefreshPayloadSchema,
      },
      auth: false,
    },
  },
];

module.exports = authenticationRoutes;
