ALTER TABLE public.sessions 
ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Sessions are viewable only by authenticated users"
    ON public.sessions FOR SELECT
    TO authenticated
    USING ( true );

CREATE POLICY "Users can create their own sessions"
    ON public.sessions FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_one_id);

-- if authenticated, and auth.uid() = user_one or user_two for the session, they can update it(but
-- but not rlly sure on how the logic should work for updates tbh..)
CREATE POLICY "Users can update their sessions"
    ON public.sessions FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_one_id OR auth.uid() = user_two_id)
    WITH CHECK (auth.uid() = user_one_id OR auth.uid() = user_two_id);