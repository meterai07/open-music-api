const postPlaylistHandler = async (request, h) => {
    try {
        const { name } = request.payload;
        const { id: credentialId } = request.auth.credentials;

        const playlistId = await PlaylistsService.addPlaylist({ name, owner: credentialId });

        return successResponse(h, { playlistId }, 'Playlist berhasil ditambahkan', 201);
    } catch (error) {
        return errorResponse(h, error.message, 500);
    }
};

// const getPlaylistsHandler = async (request, h) => {
//     try {
//         const { id: credentialId } = request.auth.credentials;
//         const playlists = await PlaylistsService.getPlaylists(credentialId);
//         return successResponse(h, { playlists });
//     } catch (error) {
//         return errorResponse(h, error.message, 500);
//     }
// };

// const deletePlaylistByIdHandler = async (request, h) => {
//     try {
//         const { id } = request.params;
//         const { id: credentialId } = request.auth.credentials;

//         await PlaylistsService.verifyPlaylistOwner(id, credentialId);
//         await PlaylistsService.deletePlaylistById(id);

//         return putDeleteResponse(h, 'Playlist berhasil dihapus');
//     } catch (error) {
//         return errorResponse(h, error.message, 500);
//     }
// };

module.exports = { postPlaylistHandler, getPlaylistsHandler, deletePlaylistByIdHandler };