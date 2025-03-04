const { postUserHandler } = require('./handlers');
const { userPayloadSchema } = require('./schema');

const userRoutes = [
    {
        method: 'POST',
        path: '/users',
        handler: postUserHandler,
        options: {
            validate: {
                payload: userPayloadSchema
            }
        }
    }
]

export default userRoutes;