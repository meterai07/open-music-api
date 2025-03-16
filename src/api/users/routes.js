const { postUserHandler } = require('./handler');
const { userPayloadSchema } = require('./schema');

const userRoutes = [
  {
    method: 'POST',
    path: '/users',
    handler: postUserHandler,
    options: {
      validate: {
        payload: userPayloadSchema,
      },
      auth: false,
    },
  },
];

module.exports = userRoutes;
