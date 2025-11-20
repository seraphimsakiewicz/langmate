-- Expose only the safe columns
CREATE OR REPLACE VIEW public_profiles AS
SELECT
  id,
  first_name,
  last_name,
  timezone,
  native_language_id,
  target_language_id,
  target_level
FROM public.profiles;

-- Let anon/authenticated select from the view (RLS on profiles still applies)
GRANT SELECT ON public.public_profiles TO anon, authenticated;

-- Broaden profiles RLS so session partners can read these rows
CREATE POLICY "Profiles select session partners"
  ON public.profiles
  FOR SELECT
  USING (
    auth.uid() = id
    OR EXISTS (
      SELECT 1
      FROM public.sessions s
      WHERE (s.user_one_id = profiles.id OR s.user_two_id = profiles.id)
        AND (s.user_one_id = auth.uid() OR s.user_two_id = auth.uid())
    )
  );
