const playlistRoutes = [
    {
        method: 'POST',
        path: '/playlists'
    },
    {
        method: 'GET',
        path: '/playlists'
    },
    {
        method: 'DELETE',
        path: '/playlists/{id}'
    },
    {
        method: 'POST',
        path: '/playlists/{id}/songs'
    },
    {
        method: 'GET',
        path: '/playlists/{id}/songs'
    },
    {
        method: 'DELETE',
        path: 'playlists/{id}/songs'
    }
];

module.exports = playlistRoutes;