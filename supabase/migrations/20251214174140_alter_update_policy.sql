ALTER POLICY "Users can update their sessions" ON sessions
USING (
  (auth.uid() = user_one_id)
  OR 
  (user_two_id IS NULL AND auth.uid() != user_one_id)
)
WITH CHECK (
  (auth.uid() = user_one_id) OR (auth.uid() = user_two_id)
);