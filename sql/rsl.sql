-- =====================================================
-- STEP 4: Enable Row Level Security on profiles -- DONE
-- =====================================================
-- Turn on RLS - now every query must pass through security policies
ALTER TABLE
  profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 5: Create RLS policies for profiles table
-- =====================================================
-- These policies control who can see/edit profile data
-- Policy 1: Users can only VIEW their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR
SELECT
  USING (auth.uid() = id);

-- auth.uid() = currently logged in user's ID
-- id = the profile's user ID
-- Only allow if they match!
-- Policy 2: Users can only UPDATE their own profile  
CREATE POLICY "Users can update own profile" ON profiles FOR
UPDATE
  USING (auth.uid() = id);

-- Same logic - users can only edit their own data
-- Policy 3: Profiles are created by the trigger (not directly by users)
-- But we need this for the trigger to work
CREATE POLICY "Enable insert for authenticated users only" ON profiles FOR
INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

-- =====================================================
-- STEP 6: Set up RLS for other tables
-- =====================================================
-- Languages table - everyone can read (reference data)
ALTER TABLE
  languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Languages are viewable by everyone" ON languages FOR
SELECT
  USING (true);

-- User languages - users can only manage their own
ALTER TABLE
  user_languages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own languages" ON user_languages FOR ALL USING (auth.uid() = user_id);

-- Need to rework how sessions will work
/*   -- Sessions - users can only see sessions they participate in
 ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
 CREATE POLICY "Users can view sessions they participate in" ON sessions
 FOR SELECT USING (
 auth.uid() = participant_one_id OR
 auth.uid() = participant_two_id
 );
 CREATE POLICY "Users can create sessions" ON sessions
 FOR INSERT WITH CHECK (auth.uid() = participant_one_id);
 CREATE POLICY "Participants can update their sessions" ON sessions
 FOR ALL USING (
 auth.uid() = participant_one_id OR
 auth.uid() = participant_two_id
 ); */
-- User favorites - users can only manage their own favorites
ALTER TABLE
  user_favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own favorites" ON user_favorites FOR ALL USING (auth.uid() = user_id);

-- User reports - users can see reports they created
ALTER TABLE
  user_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own reports" ON user_reports FOR
SELECT
  USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports" ON user_reports FOR
INSERT
  WITH CHECK (auth.uid() = reporter_id);

-- User snoozes - users can only manage their own snoozes
ALTER TABLE
  user_snoozes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own snoozes" ON user_snoozes FOR ALL USING (auth.uid() = user_id);

-- =====================================================
-- DONE! 
-- =====================================================
-- After running this:
-- 1. When users sign up, they automatically get profiles
-- 2. Users can only see/edit their own data
-- 3. auth.uid() will work properly with your RLS policies