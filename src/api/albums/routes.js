import {
    postAlbumHandler
} from './handler';

import {
    postAlbumSchema
} from './schema';

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
]