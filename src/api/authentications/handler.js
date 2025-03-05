const { verifyUserCredential } = require('../../database/services/UsersService');
const { errorResponse, successResponse } = require('../../utils/response');
const { addRefreshToken, verifyRefreshToken, deleteRefreshToken, verifyUserRefreshToken  } = require('../../database/services/AuthenticationServices');
const { generateAccessToken, generateRefreshToken } = require('../../utils/jwt');

const authenticationPostHandler = async (request, h) => {
    try {
        const { username, password } = request.payload;
        const id = await verifyUserCredential({ username, password });

        if (!id) {
            return errorResponse(h, 'Kredensial yang Anda masukkan salah', 400);
        }

        const accessToken = generateAccessToken({ id });
        const refreshToken = generateRefreshToken();
        
        const isUserAlreadyhaveAccessToken = await verifyUserRefreshToken({ user_id: id });
        
        if (isUserAlreadyhaveAccessToken.length > 0) {
            await deleteRefreshToken(isUserAlreadyhaveAccessToken[0].token);
            await addRefreshToken({ token: refreshToken, user_id: id });
        } else {
            await addRefreshToken({ token: refreshToken, user_id: id });
        }

        return successResponse(h, { accessToken, refreshToken }, 201);
    } catch (error) {
        return errorResponse(h, error, 400);
    }
}

const authenticationPutHandler = async (request, h) => {
    try {
        const { refreshToken } = request.payload;
        const isUserHaveRefreshToken = await verifyRefreshToken(refreshToken);

        if (isUserHaveRefreshToken.length === 0) {
            return errorResponse(h, 'Refresh token tidak valid', 400);
        }

        await deleteRefreshToken(refreshToken);

        const newRefreshToken = generateRefreshToken();
        await addRefreshToken({ token: newRefreshToken, user_id: isUserHaveRefreshToken[0].user_id });
        
        return successResponse(h, { refreshToken: newRefreshToken });
    } catch (error) {
        return errorResponse(h, error, 400);
    }
}

const authenticationDeleteHandler = async (request, h) => {
    try {
        const { refreshToken } = request.payload;

        const isUserHaveRefreshToken = await verifyRefreshToken(refreshToken);

        if (isUserHaveRefreshToken.length === 0) {
            return errorResponse(h, 'Refresh token tidak valid', 400);
        }

        await deleteRefreshToken(refreshToken);
        return successResponse(h, { message: 'Refresh token berhasil dihapus' });
    } catch (error) {
        return errorResponse(h, error, 400);
    }
}

module.exports = { authenticationPostHandler, authenticationPutHandler, authenticationDeleteHandler };