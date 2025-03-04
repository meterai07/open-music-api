const authenticationPostHandler = async (request, h) => {
    try {
        // const { username, password } = request.payload;
        // const id = await UsersService.verifyUserCredential(username, password);
        // const accessToken = TokenManager.generateAccessToken({ id });

        // return successResponse(h, { accessToken }, 'Authentication berhasil', 201);
    } catch (error) {
        // return errorResponse(h, error, 400);
    }
}

const authenticationPutHandler = async (request, h) => {
    try {
        // const { refreshToken } = request.payload;
        // TokenManager.verifyRefreshToken(refreshToken);
        // const { id } = TokenManager.decodePayload(refreshToken);
        // const accessToken = TokenManager.generateAccessToken({ id });

        // return successResponse(h, { accessToken });
    } catch (error) {
        // return errorResponse(h, error, 400);
    }
}

const authenticationDeleteHandler = async (request, h) => {
    try {
        // const { refreshToken } = request.payload;
        // TokenManager.verifyRefreshToken(refreshToken);
        // TokenManager.verifyRefreshToken(refreshToken);
        // TokenManager.verifyRefreshToken(refreshToken);

        // return successResponse(h, 'Refresh token berhasil dihapus');
    } catch (error) {
        // return errorResponse(h, error, 400);
    }
}

module.exports = { authenticationPostHandler, authenticationPutHandler, authenticationDeleteHandler };