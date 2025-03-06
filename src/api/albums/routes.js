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
            auth: false
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
            },
            auth: false
        }
    },
    {
        method: 'DELETE',
        path: '/albums/{id}',
        handler: deleteAlbumByIdHandler,
        options: {
            validate: {
                params: albumIdSchema
            },
            auth: false
        }
    }
]

module.exports = albumRoutes;