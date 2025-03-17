const { verifyUserCredential } = require('../../database/services/UserServices');
const { errorResponse, successResponse, putDeleteResponse } = require('../../utils/response');
const {
  addRefreshToken,
  getRefreshTokenByToken,
  deleteRefreshToken,
  getUserRefreshTokenByUserId,
} = require('../../database/services/AuthenticationServices');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../utils/jwt');
const messages = require('../../utils/const/message');
const status_code = require('../../utils/const/status_code');

const authenticationPostHandler = async (request, h) => {
  try {
    const { username, password } = request.payload;
    const id = await verifyUserCredential({ username, password });

    if (!id) {
      return errorResponse(h, messages.INCORRECT_CREDENTIAL, status_code.UNAUTHORIZED);
    }

    const accessToken = generateAccessToken({ id });
    const refreshToken = generateRefreshToken({ id });

    const isUserAlreadyHaveAccessToken = await getUserRefreshTokenByUserId({ user_id: id });

    if (isUserAlreadyHaveAccessToken.length > 0) {
      await deleteRefreshToken(isUserAlreadyHaveAccessToken[0].token);
    }

    await addRefreshToken({ token: refreshToken, user_id: id });

    return successResponse(h, { accessToken, refreshToken }, status_code.CREATED);
  } catch (error) {
    return errorResponse(h, error.message, status_code.BAD_REQUEST);
  }
};

const authenticationPutHandler = async (request, h) => {
  try {
    const { refreshToken } = request.payload;
    const isUserHaveRefreshToken = await getRefreshTokenByToken(refreshToken);

    if (isUserHaveRefreshToken.length === 0) {
      return errorResponse(h, messages.REFRESH_TOKEN_INVALID, status_code.BAD_REQUEST);
    }

    const payload = verifyRefreshToken(refreshToken);
    if (!payload) {
      return errorResponse(h, messages.REFRESH_TOKEN_INVALID, status_code.BAD_REQUEST);
    }

    const newAccessToken = generateAccessToken({ id: payload.id });
    return successResponse(h, { accessToken: newAccessToken });
  } catch (error) {
    return errorResponse(h, error, status_code.BAD_REQUEST);
  }
};

const authenticationDeleteHandler = async (request, h) => {
  try {
    const { refreshToken } = request.payload;

    const isUserHaveRefreshToken = await getRefreshTokenByToken(refreshToken);

    if (isUserHaveRefreshToken.length === 0) {
      return errorResponse(h, messages.REFRESH_TOKEN_INVALID, status_code.BAD_REQUEST);
    }

    await deleteRefreshToken(refreshToken);
    return putDeleteResponse(h, messages.REFERESH_TOKEN_DELETED, status_code.SUCCESS);
  } catch (error) {
    return errorResponse(h, error, status_code.BAD_REQUEST);
  }
};

module.exports = {
  authenticationPostHandler,
  authenticationPutHandler,
  authenticationDeleteHandler,
};
