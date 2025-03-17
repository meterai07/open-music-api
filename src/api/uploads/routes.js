const path = require('path');

const uploadRoutes = [
    {
        method: 'GET',
        path: '/uploads/pictures/{param*}',
        handler: {
            directory: {
                path: path.resolve(__dirname, '../uploads/pictures'),
            }
        },
        options: {
            auth: false,
        },
    }
];

module.exports = uploadRoutes;