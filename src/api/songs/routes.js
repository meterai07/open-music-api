const {
    postSongHandler,
    getSongsHandler,
    getSongByIdHandler,
    putSongByIdHandler,
    deleteSongByIdHandler
} = require('./handler');

const {
    songPayloadSchema,
    songIdSchema,
    songQuerySchema
} = require('./schema');

const songRoutes = [
    {
        method: 'POST',
        path: '/songs',
        handler: postSongHandler,
        options: {
            validate: {
                payload: songPayloadSchema
            },
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/songs',
        handler: getSongsHandler,
        options: {
            validate: {
                query: songQuerySchema
            },
            auth: false
        }
    },
    {
        method: 'GET',
        path: '/songs/{id}',
        handler: getSongByIdHandler,
        options: {
            validate: {
                params: songIdSchema
            },
            auth: false
        }
    },
    {
        method: 'PUT',
        path: '/songs/{id}',
        handler: putSongByIdHandler,
        options: {
            validate: {
                params: songIdSchema,
                payload: songPayloadSchema
            },
            auth: false
        }
    },
    {
        method: 'DELETE',
        path: '/songs/{id}',
        handler: deleteSongByIdHandler,
        options: {
            validate: {
                params: songIdSchema
            },
            auth: false
        }
    }
];

module.exports = songRoutes;