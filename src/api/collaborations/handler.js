const { addCollaboration, deleteCollaboration } = require('../../database/services//CollaborationServices');
const { getPlaylists, getPlaylistDetails } = require('../../database/services/PlaylistServices');
const { getUserById } = require('../../database/services/UserServices');
const messages = require('../../utils/const/message');
const status_code = require('../../utils/const/status_code');
const { successResponse, errorResponse, putDeleteResponse } = require('../../utils/response');

const postCollaborationHandler = async (request, h) => {
    try {       
        const { playlistId, userId } = request.payload;
        const ownerId = request.auth.credentials.id;

        const playlist = await getPlaylistDetails(playlistId);
        if (!playlist) {
            return errorResponse(h, messages.PLAYLIST_NOT_FOUND, status_code.NOT_FOUND);
        }

        if (playlist.owner !== ownerId) {
            return errorResponse(h, messages.NO_ACCESS, status_code.FORBIDDEN);
        }

        const collaborationUser = await getUserById(userId);
        if (!collaborationUser) {
            return errorResponse(h, messages.USER_NOT_FOUND, status_code.NOT_FOUND);
        }

        const collaborationId = await addCollaboration(playlistId, ownerId, userId);
        return successResponse(h, { collaborationId }, status_code.CREATED);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

const deleteCollaborationHandler = async (request, h) => {
    try {
        const { playlistId, userId } = request.payload;
        const ownerId = request.auth.credentials.id;

        const playlist = await getPlaylistDetails(playlistId);
        if (!playlist) {
            return errorResponse(h, messages.PLAYLIST_NOT_FOUND, status_code.NOT_FOUND);
        }

        if (playlist.owner !== ownerId) {
            return errorResponse(h, messages.NO_ACCESS, status_code.FORBIDDEN);  
        }

        const result = await deleteCollaboration(playlistId, userId);

        if (result.rowCount === 0) {
            return errorResponse(h, messages.COLLABORATION_NOT_FOUND, status_code.NOT_FOUND);
        }

        return putDeleteResponse(h, messages.COLLABORATION_DELETED, status_code.SUCCESS);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

module.exports = { postCollaborationHandler, deleteCollaborationHandler };