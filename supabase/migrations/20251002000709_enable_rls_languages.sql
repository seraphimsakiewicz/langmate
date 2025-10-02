-- Enable RLS on languages table
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read languages (reference data)
CREATE POLICY "Languages are viewable by anyone"
    ON public.languages
    FOR SELECT
    USING (true);

-- Grant schema access
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant read access to languages table
GRANT SELECT ON public.languages TO anon, authenticated;
