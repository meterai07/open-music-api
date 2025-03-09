const { collaborationPayloadSchema } = require("./schema");
const { postCollaborationHandler, deleteCollaborationHandler} = require("./handler");

const collaborationRoutes = [
    {
        method: 'POST',
        path: '/collaborations',
        handler: postCollaborationHandler,
        options: {
            validate: {
                payload: collaborationPayloadSchema
            },
            auth: 'openmusic_jwt'
        }
    },
    {
        method: 'DELETE',
        path: '/collaborations',
        handler: deleteCollaborationHandler,
        options: {
            validate: {
                payload: collaborationPayloadSchema
            },
            auth: 'openmusic_jwt'
        }
    }
];

module.exports = collaborationRoutes;