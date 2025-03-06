/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
    pgm.createTable('users', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        username: {
            type: 'TEXT',
            notNull: true,
            unique: true,
        },
        password: {
            type: 'TEXT',
            notNull: true,
        },
        fullname: {
            type: 'TEXT',
            notNull: true,
        }
    });

    pgm.createTable('playlists', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
            references: 'users(id)',
            onDelete: 'CASCADE'
        }
    });

    pgm.createTable('playlist_songs', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        playlist_id: {
            type: 'VARCHAR(50)',
            references: 'playlists(id)',
            onDelete: 'CASCADE'
        },
        song_id: {
            type: 'VARCHAR(50)',
            references: 'songs(id)',
            onDelete: 'CASCADE'
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.dropTable('playlist_songs');
    pgm.dropTable('playlists');
    pgm.dropTable('users');
 };
