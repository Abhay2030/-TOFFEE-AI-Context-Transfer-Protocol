/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable('contact_messages', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(255)', notNull: true },
    email: { type: 'varchar(255)', notNull: true },
    topic: { type: 'varchar(255)', notNull: true },
    message: { type: 'text', notNull: true },
    user_id: { type: 'varchar(255)' }, // Optional, if logged in
    status: { type: 'varchar(50)', notNull: true, default: 'unread' }, // unread, read, replied
    created_at: {
      type: 'timestamp',
      notNull: true,
      default: pgm.func('current_timestamp'),
    },
  });

  pgm.createIndex('contact_messages', 'email', { name: 'idx_contact_messages_email' });
  pgm.createIndex('contact_messages', 'created_at', { name: 'idx_contact_messages_created_at' });
};

exports.down = pgm => {
  pgm.dropTable('contact_messages');
};
