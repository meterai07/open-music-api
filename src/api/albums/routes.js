const { postAlbumHandler, getAlbumByIdHandler, putAlbumByIdHandler, deleteAlbumByIdHandler, postAlbumCoverHandler, postLikeAlbumHandler, deleteLikeAlbumHandler, getLikeAlbumHandler } = require('./handler');
const { albumPayloadSchema, albumIdSchema, albumCoverPayloadSchema } = require('./schema');

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
    },
    {
        method: 'POST',
        path: '/albums/{id}/covers',
        handler: postAlbumCoverHandler,
        options: {
            validate: {
                params: albumIdSchema,
                payload: albumCoverPayloadSchema
            },
            auth: false
        }
    },
    {
        method: 'POST',
        path: '/albums/{id}/likes',
        handler: postLikeAlbumHandler,
        options: {
            validate: {
                params: albumIdSchema
            },
        }
    },
    {
        method: 'DELETE',
        path: '/albums/{id}/likes',
        handler: deleteLikeAlbumHandler,
        options: {
            validate: {
                params: albumIdSchema
            },
        }
    },
    {
        method: 'GET',
        path: '/albums/{id}/likes',
        handler: getLikeAlbumHandler,
        options: {
            validate: {
                params: albumIdSchema
            },
        }
    }
]

module.exports = albumRoutes;