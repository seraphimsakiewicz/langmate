-- enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- ensure the auth roles can reach the table
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- policies
CREATE POLICY "Profiles insert self"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Profiles select self"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Profiles update self"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
