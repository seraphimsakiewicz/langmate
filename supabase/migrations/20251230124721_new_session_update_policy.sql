ALTER POLICY "Users can update their sessions" ON public.sessions
USING (
  auth.uid() = user_one_id           -- user_one can always update
  OR auth.uid() = user_two_id        -- user_two can update (for leaving)
  OR user_two_id IS NULL             -- anyone can update to join
)
WITH CHECK (true);