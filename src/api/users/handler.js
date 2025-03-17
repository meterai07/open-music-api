const { addUser, getUserById } = require('../../database/services/UserServices');
const { successResponse, errorResponse } = require('../../utils/response');
const messages = require('../../utils/const/message');
const statusCode = require('../../utils/const/statusCode');

const postUserHandler = async (request, h) => {
  try {
    const { username, password, fullname } = request.payload;

    const id = await addUser({ username, password, fullname });
    return successResponse(h, { userId: id }, statusCode.CREATED);
  } catch (error) {
    return errorResponse(h, error.message, statusCode.BAD_REQUEST);
  }
};

const getUserByIdHandler = async (request, h) => {
  try {
    const { id } = request.params;
    const user = await getUserById(id);

    if (!user) {
      return errorResponse(h, messages.USER_NOT_FOUND, statusCode.NOT_FOUND);
    }

    return successResponse(h, { user });
  } catch (error) {
    return errorResponse(h, error.message, statusCode.ERROR);
  }
};

module.exports = { postUserHandler, getUserByIdHandler };
