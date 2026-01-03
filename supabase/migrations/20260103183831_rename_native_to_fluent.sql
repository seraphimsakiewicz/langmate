ALTER TABLE profiles 
  RENAME COLUMN native_language_id TO fluent_language_id;

ALTER TABLE profiles 
  ADD COLUMN is_native BOOLEAN DEFAULT TRUE NOT NULL;

-- Drop view first (required for column rename)
DROP VIEW IF EXISTS public_profiles;

-- Recreate with new column names
CREATE VIEW public_profiles 
WITH (security_invoker = true)
AS
SELECT
  id,
  first_name,
  last_name,
  timezone,
  fluent_language_id,
  target_language_id,
  target_level,
  is_native
FROM public.profiles;

-- Re-grant permissions
GRANT SELECT ON public.public_profiles TO anon, authenticated;
