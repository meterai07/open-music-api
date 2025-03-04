const handler = require("../songs/handler");
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
            }
        }
    },
    {
        method: 'DELETE',
        path: '/collaborations',
        handler: deleteCollaborationHandler,
        options: {
            validate: {
                payload: collaborationPayloadSchema
            }
        }
    }
];

module.exports = collaborationRoutes;