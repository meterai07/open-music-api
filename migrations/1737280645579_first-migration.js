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
  pgm.createTable("albums", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    name: {
      type: "varchar(255)",
      notNull: true,
    },
    year: {
      type: "integer",
      notNull: true,
    },
  });
  pgm.createTable("songs", {
    id: {
      type: "varchar(50)",
      primaryKey: true,
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    year: {
      type: "integer",
      notNull: true,
    },
    genre: {
      type: "varchar(255)",
      notNull: true,
    },
    performer: {
      type: "varchar(255)",
      notNull: true,
    },
    duration: {
      type: "integer",
      notNull: false,
    },
    album_id: {
      type: "varchar(50)",
      references: "albums(id)",
      onDelete: "SET NULL",
      allowNull: true,
    },
  });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.dropTable("songs");
  pgm.dropTable("albums");
};
