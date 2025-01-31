require('dotenv').config();

const Hapi = require('@hapi/hapi');
const albumRoutes = require('./api/albums/routes');

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

  // server.route(routes);
  server.route([...albumRoutes]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;
    if (response.isBoom) {
      const statusCode = response.output.statusCode;
      return h.response({
        status: statusCode === 404 ? 'fail' : 'error',
        message: response.message,
      }).code(statusCode);
    }
    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
