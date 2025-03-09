const { successResponse, errorResponse, putDeleteResponse } = require('../../utils/response');
const { addPlaylist, getPlaylists, deletePlaylistById, addSongToPlaylist, getSongsFromPlaylist, deleteSongFromPlaylist, getPlaylistDetails } = require('../../database/services/PlaylistServices');
const { addPlaylistActivity, getPlaylistActivities } = require('../../database/services/ActivityServices');
const { getUserById } = require('../../database/services/UserServices');
const { getSongsById } = require('../../database/services/SongServices');
const messages = require('../../utils/const/message');
const status_code = require('../../utils/const/status_code');

const postPlaylistHandler = async (request, h) => {
    try { 
        const { name } = request.payload;
        const userId = request.auth.credentials.id;
        
        const playlistId = await addPlaylist({ name, owner: userId });

        return successResponse(h, { playlistId }, status_code.CREATED);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

const getAllPlaylistsHandler = async (request, h) => {
    try {
        const userId = request.auth.credentials.id;
        const playlists = await getPlaylists(userId);
        
        if (!playlists.length) {
            return successResponse(h, { playlists: [] });
        }

        const user = await getUserById(userId);
        if (!user) {
            return errorResponse(h, messages.USER_NOT_FOUND, status_code.NOT_FOUND);
        }

        const modifiedPlaylists = playlists.map(playlist => ({
            id: playlist.id,
            name: playlist.name,
            username: playlist.username
        }));

        return successResponse(h, { playlists: modifiedPlaylists });
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};


const deletePlaylistByIdHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const userId = request.auth.credentials.id;

        const playlists = await getPlaylists(userId);
        const playlist = playlists.find(playlist => playlist.id === id);
        if (!playlist) {
            return errorResponse(h, messages.NO_ACCESS, status_code.FORBIDDEN);
        }
        
        await deletePlaylistById(id, userId);

        return putDeleteResponse(h, messages.PLAYLIST_DELETED, status_code.SUCCESS);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

const postSongToPlaylistHandler = async (request, h) => {
    try {        
        const { songId } = request.payload;
        const { id } = request.params;
        const userId = request.auth.credentials.id;

        const song = await getSongsById(songId);        
        if (song.rowCount === 0) {
            return errorResponse(h, messages.SONG_NOT_FOUND, status_code.NOT_FOUND);
        }

        const playlists = await getPlaylists(userId);                
        const playlist = playlists.find(playlist => playlist.id === id);        
        if (!playlist) {
            return errorResponse(h, messages.NO_ACCESS, status_code.FORBIDDEN);
        }

        const result = await addSongToPlaylist({ playlistId: id, songId });
        if (result.rowCount !== 0) {
            await addPlaylistActivity({ playlistId: id, userId, songId, action: messages.ACTIVITIES_ADD });
        }
        
        return putDeleteResponse(h, messages.SONG_CREATED, status_code.CREATED);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

const getSongsFromPlaylistHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const userId = request.auth.credentials.id;

        const playlistDetails = await getPlaylistDetails(id);        
        if (!playlistDetails) {
            return errorResponse(h, messages.PLAYLIST_NOT_FOUND, status_code.NOT_FOUND);
        }

        if (playlistDetails.owner !== userId) {
            return errorResponse(h, messages.NO_ACCESS, status_code.FORBIDDEN);
        }

        const songs = await getSongsFromPlaylist(id);

        const playlist = {
            id: playlistDetails.id,
            name: playlistDetails.name,
            username: playlistDetails.username,
            songs: songs
        };

        return successResponse(h, { playlist });
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

const deleteSongFromPlaylistHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const { songId } = request.payload;
        const userId = request.auth.credentials.id;

        const playlists = await getPlaylists(userId);
        const playlist = playlists.find(playlist => playlist.id === id);
        if (!playlist) {
            return errorResponse(h, messages.NO_ACCESS, status_code.FORBIDDEN);
        }

        const result = await deleteSongFromPlaylist(id, songId, userId);
        if (result.rowCount !== 0) {
            await addPlaylistActivity({ playlistId: id, userId, songId, action: messages.ACTIVITIES_DELETE });
        }

        return putDeleteResponse(h, messages.SONG_DELETED, status_code.SUCCESS);
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

const getPlaylistActivitiesHandler = async (request, h) => {
    try {
        const { id } = request.params;
        const userId = request.auth.credentials.id;

        const activities = await getPlaylistActivities(id);
        
        const activity = activities.find(activity => activity.user_id === userId);
        if (activities.length === 0) {
            return errorResponse(h, messages.PLAYLIST_NOT_FOUND, status_code.NOT_FOUND);
        };

        if (!activity) {
            return errorResponse(h, messages.NO_ACCESS, status_code.FORBIDDEN);
        }
        
        const modifiedActivities = activities.map(activity => ({
            username: activity.username,
            songTitle: activity.title,
            action: activity.action,
            time: activity.time
        }));

        return successResponse(h, {
            playlistId: id,
            activities: modifiedActivities
        });
    } catch (error) {
        return errorResponse(h, error.message, status_code.ERROR);
    }
};

module.exports = { postPlaylistHandler, getAllPlaylistsHandler, deletePlaylistByIdHandler, postSongToPlaylistHandler, getSongsFromPlaylistHandler, deleteSongFromPlaylistHandler, getPlaylistActivitiesHandler };