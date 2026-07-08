exports.up = (pgm) => {
  // Migration bypassed: We no longer use Supabase auth, and vanilla Postgres doesn't have the auth schema.
  pgm.sql(`SELECT 1;`);
};

exports.down = (pgm) => {
  pgm.sql(`SELECT 1;`);
};
