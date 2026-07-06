/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createIndex('share_links', 'token', { name: 'idx_share_links_token' });
  pgm.createIndex('injection_events', 'user_id', { name: 'idx_injection_events_user_id' });
  pgm.createIndex('token_usage_log', 'user_id', { name: 'idx_token_usage_log_user_id' });
};

exports.down = pgm => {
  pgm.dropIndex('share_links', 'token', { name: 'idx_share_links_token' });
  pgm.dropIndex('injection_events', 'user_id', { name: 'idx_injection_events_user_id' });
  pgm.dropIndex('token_usage_log', 'user_id', { name: 'idx_token_usage_log_user_id' });
};
