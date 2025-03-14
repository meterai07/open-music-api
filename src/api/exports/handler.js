const { errorResponse, successResponse, putDeleteResponse } = require('../../utils/response');
const { getPlaylistById, getSongsFromPlaylist } = require('../../database/services/PlaylistServices');
const messages = require('../../utils/const/message');
const status_code = require('../../utils/const/status_code');
const { sendMessage } = require('../../database/services/ProducerServices');

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

        const songs = await getSongsFromPlaylist(playlist.id);

        const message = JSON.stringify({
            playlist: {
                id: playlist.id,
                name: playlist.name,
                songs: songs.map(song => ({
                    id: song.id,
                    title: song.title,
                    performer: song.performer
                }))
            },
            targetEmail
        });

        await sendMessage('export:playlist', message);

        return putDeleteResponse(h, messages.EXPORT_PLAYLIST_SUCCESS, status_code.CREATED);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

module.exports = { postExportPlaylistHandler };