CREATE POLICY "Users can delete their sessions"
ON public.sessions
FOR DELETE
TO authenticated
USING (auth.uid() = user_one_id OR auth.uid() = user_two_id);

GRANT DELETE ON public.sessions TO authenticated;