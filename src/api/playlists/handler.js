const { successResponse, errorResponse, putDeleteResponse } = require('../../utils/response');
const { addPlaylist, getPlaylists, deletePlaylistById } = require('../../database/services/PlaylistServices');
const { getUserById } = require('../../database/services/UsersService');

const postPlaylistHandler = async (request, h) => {
    try { 
        const { name } = request.payload;
        const userId = request.auth.credentials.id;
        
        const playlistId = await addPlaylist({ name, owner: userId });

        return successResponse(h, { playlistId }, 201);
    } catch (error) {
        return errorResponse(h, error.message, 500);
    }
};

const getAllPlaylistsHandler = async (request, h) => {
    try {
        const userId = request.auth.credentials.id;
        const playlists = await getPlaylists(userId);

        const user = await getUserById(userId);

        const modifiedPlaylists = playlists.map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            username: user.fullname
        }));

        return successResponse(h, { playlists: modifiedPlaylists });
    } catch (error) {
        return errorResponse(h, error.message, 500);
    }
}

const deletePlaylistByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const userId = request.auth.credentials.id;

        await deletePlaylistById(id, userId);

        return putDeleteResponse(h, 'Playlist berhasil dihapus', 200);
    } catch (error) {
        return errorResponse(h, error.message, 500);
    }
}

const postSongToPlaylistHandler = async (request, h) => {
    try {
        const { playlistId, songId } = request.payload;
        const userId = request.auth.credentials.id;

        await addSongToPlaylist(playlistId, songId, userId);

        return successResponse(h, { message: 'Lagu berhasil ditambahkan ke playlist' }, 201);
    } catch (error) {
        return errorResponse(h, error.message, 500);
    }
}

const getSongsFromPlaylistHandler = async (request, h) => {
    
}

const deleteSongFromPlaylistHandler = async (request, h) => {
    
}

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

module.exports = { postPlaylistHandler, getAllPlaylistsHandler, deletePlaylistByIdHandler, postSongToPlaylistHandler, getSongsFromPlaylistHandler, deleteSongFromPlaylistHandler };