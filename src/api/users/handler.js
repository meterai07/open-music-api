const { addUser } = require('../../database/services/UsersService');
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

module.exports = { postUserHandler };