exports.up = (pgm) => {
  // Create a function that handles the insert from auth.users to public.users
  pgm.sql(`
    CREATE OR REPLACE FUNCTION public.handle_new_user()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO public.users (id, email, auth_provider, plan_tier)
      VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_app_meta_data->>'provider', 'email'),
        'free'
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `);

  // Create the trigger on auth.users
  pgm.sql(`
    CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
  `);
};

exports.down = (pgm) => {
  pgm.sql(`DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;`);
  pgm.sql(`DROP FUNCTION IF EXISTS public.handle_new_user();`);
};
