const { options } = require("joi");
const { authenticationPayloadSchema } = require("./schema");
const { authenticationPostHandler, authenticationPutHandler, authenticationDeleteHandler } = require("./handler");

const authenticationRoutes = [
    {
        method: 'POST',
        path: '/authentications',
        handler: authenticationPostHandler,
        options: {
            validate: {
                payload: authenticationPayloadSchema
            }
        }
    },
    {
        method: 'PUT',
        path: '/authentications',
        handler: authenticationPutHandler,
        options: {
            validate: {
                payload: authenticationPayloadSchema
            }
        }
    },
    {
        method: 'DELETE',
        path: '/authentications',
        handler: authenticationDeleteHandler,
        options: {
            validate: {
                payload: authenticationPayloadSchema
            }
        }
    }
];

module.exports = authenticationRoutes;