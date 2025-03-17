const { addCollaboration, deleteCollaboration } = require('../../database/services/CollaborationServices');
const { getPlaylistDetails } = require('../../database/services/PlaylistServices');
const { getUserById } = require('../../database/services/UserServices');
const { successResponse, errorResponse, putDeleteResponse } = require('../../utils/response');
const messages = require('../../utils/const/message');
const statusCode = require('../../utils/const/statusCode');

const postCollaborationHandler = async (request, h) => {
  try {
    const { playlistId, userId } = request.payload;
    const ownerId = request.auth.credentials.id;

    const playlist = await getPlaylistDetails(playlistId);
    if (!playlist) {
      return errorResponse(h, messages.PLAYLIST_NOT_FOUND, statusCode.NOT_FOUND);
    }

    if (playlist.owner !== ownerId) {
      return errorResponse(h, messages.NO_ACCESS, statusCode.FORBIDDEN);
    }

    const collaborationUser = await getUserById(userId);
    if (!collaborationUser) {
      return errorResponse(h, messages.USER_NOT_FOUND, statusCode.NOT_FOUND);
    }

    const collaborationId = await addCollaboration(playlistId, ownerId, userId);
    return successResponse(h, { collaborationId }, statusCode.CREATED);
  } catch (error) {
    return errorResponse(h, error.message, statusCode.ERROR);
  }
};

const deleteCollaborationHandler = async (request, h) => {
  try {
    const { playlistId, userId } = request.payload;
    const ownerId = request.auth.credentials.id;

    const playlist = await getPlaylistDetails(playlistId);
    if (!playlist) {
      return errorResponse(h, messages.PLAYLIST_NOT_FOUND, statusCode.NOT_FOUND);
    }

    if (playlist.owner !== ownerId) {
      return errorResponse(h, messages.NO_ACCESS, statusCode.FORBIDDEN);
    }

    const result = await deleteCollaboration(playlistId, userId);

    if (result.rowCount === 0) {
      return errorResponse(h, messages.COLLABORATION_NOT_FOUND, statusCode.NOT_FOUND);
    }

    return putDeleteResponse(h, messages.COLLABORATION_DELETED, statusCode.SUCCESS);
  } catch (error) {
    return errorResponse(h, error.message, statusCode.ERROR);
  }
};

module.exports = { postCollaborationHandler, deleteCollaborationHandler };
