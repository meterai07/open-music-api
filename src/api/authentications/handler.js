const { verifyUserCredential } = require('../../database/services/UsersService');
const { errorResponse, successResponse, putDeleteResponse } = require('../../utils/response');
const { addRefreshToken, getRefreshTokenByToken, deleteRefreshToken, getUserRefreshTokenByUserId } = require('../../database/services/AuthenticationServices');
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require('../../utils/jwt');

const authenticationPostHandler = async (request, h) => {
    try {
        const { username, password } = request.payload;
        const id = await verifyUserCredential({ username, password });

        if (!id) {
            return errorResponse(h, 'Kredensial yang Anda masukkan salah', 400);
        }

        const accessToken = generateAccessToken({ id });
        const refreshToken = generateRefreshToken({ id });

        const isUserAlreadyHaveAccessToken = await getUserRefreshTokenByUserId({ user_id: id });

        if (isUserAlreadyHaveAccessToken.length > 0) {
            await deleteRefreshToken(isUserAlreadyHaveAccessToken[0].token);
        }
        
        await addRefreshToken({ token: refreshToken, user_id: id });

        return successResponse(h, { accessToken, refreshToken }, 201);
    } catch (error) {
        return errorResponse(h, error.message, 400);
    }
}

const authenticationPutHandler = async (request, h) => {
    try {
        const { refreshToken } = request.payload;
        const isUserHaveRefreshToken = await getRefreshTokenByToken(refreshToken);

        if (isUserHaveRefreshToken.length === 0) {
            return errorResponse(h, 'Refresh token tidak valid', 400);
        }

        const payload = verifyRefreshToken(refreshToken);
        if (!payload) {
            return errorResponse(h, 'Refresh token tidak valid', 400);
        }
        
        // must add check if refresh token is still valid

        const newAccessToken = generateAccessToken({ id: payload.id });
        return successResponse(h, { accessToken: newAccessToken });
    } catch (error) {
        return errorResponse(h, error, 400);
    }
}

const authenticationDeleteHandler = async (request, h) => {
    try {
        const { refreshToken } = request.payload;

        const isUserHaveRefreshToken = await getRefreshTokenByToken(refreshToken);

        if (isUserHaveRefreshToken.length === 0) {
            return errorResponse(h, 'Refresh token tidak valid', 400);
        }

        await deleteRefreshToken(refreshToken);
        return putDeleteResponse(h, 'Refresh token berhasil dihapus', 200);
    } catch (error) {
        return errorResponse(h, error, 400);
    }
}

module.exports = { authenticationPostHandler, authenticationPutHandler, authenticationDeleteHandler };