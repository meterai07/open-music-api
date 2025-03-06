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
    pgm.alterColumn('playlists', 'owner', {
        type: 'VARCHAR(50)',
        notNull: true,
        references: 'users(id)',
        onDelete: 'CASCADE',
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
    pgm.alterColumn('playlists', 'owner', {
        type: 'VARCHAR(50)',
        notNull: true,
    });
};
