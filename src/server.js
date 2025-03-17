require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const albumRoutes = require('./api/albums/routes');
const songRoutes = require('./api/songs/routes');
const authenticationRoutes = require('./api/authentications/routes');
const userRoutes = require('./api/users/routes');
const playlistRoutes = require('./api/playlists/routes');
const collaborationRoutes = require('./api/collaborations/routes');
const exportRoute = require('./api/exports/routes');

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      nbf: true,
      exp: true,
      maxAgeSec: 14400,
    },
    validate: async (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  server.auth.default('openmusic_jwt');

  server.route(
    [
      ...albumRoutes,
      ...songRoutes,
      ...userRoutes,
      ...playlistRoutes,
      ...authenticationRoutes,
      ...collaborationRoutes,
      ...exportRoute,
    ],
  );

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response.isBoom) {
      const { statusCode } = response.output;
      const status = [400, 402, 403, 404].includes(statusCode) ? 'fail' : 'error';
      return h.response({
        status,
        message: response.message,
      }).code(statusCode);
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
