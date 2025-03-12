const postExportPlaylistHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const { targetEmail } = request.payload;
        const userId = request.auth.credentials.id;

        const playlist = await getPlaylistById(id);
        if (!playlist) {
            return errorResponse(h, messages.PLAYLIST_NOT_FOUND, status_code.NOT_FOUND);
        }

        if (playlist.owner !== userId) {
            return errorResponse(h, messages.NO_ACCESS, status_code.FORBIDDEN);
        }

        // const exportPlaylist = await createExportPlaylist(id, targetEmail);

        // get playlist songs

        // prepare message for rabbitmq

        // send message to rabbitmq

        return successResponse(h, { exportId: exportPlaylist.id }, status_code.CREATED);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
}