/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  // Drop foreign keys first to allow altering the referenced column
  pgm.dropConstraint('toffee_bundles', 'toffee_bundles_user_id_fkey', { ifExists: true });
  pgm.dropConstraint('share_links', 'share_links_created_by_fkey', { ifExists: true });
  pgm.dropConstraint('injection_events', 'injection_events_user_id_fkey', { ifExists: true });

  // Alter columns to varchar(255) to support Firebase UIDs
  pgm.sql('ALTER TABLE users ALTER COLUMN id DROP DEFAULT;');
  pgm.sql('ALTER TABLE users ALTER COLUMN id TYPE varchar(255) USING id::varchar;');
  
  pgm.sql('ALTER TABLE toffee_bundles ALTER COLUMN user_id TYPE varchar(255) USING user_id::varchar;');
  pgm.sql('ALTER TABLE share_links ALTER COLUMN created_by TYPE varchar(255) USING created_by::varchar;');
  pgm.sql('ALTER TABLE injection_events ALTER COLUMN user_id TYPE varchar(255) USING user_id::varchar;');
  pgm.sql('ALTER TABLE token_usage_log ALTER COLUMN user_id TYPE varchar(255) USING user_id::varchar;');
  pgm.sql('ALTER TABLE audit_log ALTER COLUMN user_id TYPE varchar(255) USING user_id::varchar;');

  // Re-add foreign keys
  pgm.addConstraint('toffee_bundles', 'toffee_bundles_user_id_fkey', {
    foreignKeys: { columns: 'user_id', references: 'users(id)', onDelete: 'CASCADE' }
  });
  pgm.addConstraint('share_links', 'share_links_created_by_fkey', {
    foreignKeys: { columns: 'created_by', references: 'users(id)' }
  });
  pgm.addConstraint('injection_events', 'injection_events_user_id_fkey', {
    foreignKeys: { columns: 'user_id', references: 'users(id)' }
  });
};

exports.down = pgm => {
  // It's non-trivial to safely cast arbitrary varchar back to UUID, 
  // so the down migration just leaves it as varchar.
  pgm.sql(`SELECT 1;`);
};
