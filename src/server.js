require('dotenv').config();

const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const albumRoutes = require('./api/albums/routes');
const songRoutes = require('./api/songs/routes');
const authenticationRoutes = require('./api/authentications/routes');
const userRoutes = require('./api/users/routes');

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
      plugin: Jwt
    }
  ]);

  server.auth.strategy('openmusic_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE || 1800,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  server.auth.default('openmusic_jwt');

  server.route([...albumRoutes, ...songRoutes, ...userRoutes]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response.isBoom) {
      const statusCode = response.output.statusCode;
      const status = [400, 401, 402, 403, 404].includes(statusCode) ? 'fail' : 'error';
      // const status = statusCode >= 400 && statusCode <= 499 ? 'fail' : 'error';
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
