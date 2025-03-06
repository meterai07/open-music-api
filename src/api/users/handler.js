const { addUser, getUserById } = require('../../database/services/UsersService');
const { successResponse, errorResponse } = require('../../utils/response');

const postUserHandler = async (request, h) => {
    try {
        const { username, password, fullname } = request.payload;

        const id = await addUser({ username, password, fullname });
        return successResponse(h, { userId: id }, 201);
    } catch (error) {
        return errorResponse(h, error.message, 400);
    }
};

const getUserByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const user = await getUserById(id);

        if (!user) {
            return errorResponse(h, 'User not found', 404);
        }

        return successResponse(h, { user });
    } catch (error) {
        return errorResponse(h, error.message, 500);
    }
}

module.exports = { postUserHandler, getUserByIdHandler };