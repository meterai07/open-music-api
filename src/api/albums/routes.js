const { postAlbumHandler, getAlbumByIdHandler, putAlbumByIdHandler, deleteAlbumByIdHandler } = require('./handler');
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
        },
    },
    {
        method: 'PUT',
        path: '/albums/{id}',
        handler: putAlbumByIdHandler,
        options: {
            validate: {
                params: albumIdSchema,
                payload: albumPayloadSchema
            }
        }
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: deleteAlbumByIdHandler,
        options: {
            validate: {
                params: albumIdSchema
            }
        }
    }
]

module.exports = albumRoutes;