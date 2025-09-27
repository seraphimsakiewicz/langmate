-- Simplified Langmate MVP Schema
-- Focus: 1-on-1 matching, 25 min sessions (12.5 min each language)
-- Core user profiles
CREATE TABLE "profiles" (
  "id" uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "email" varchar(255) UNIQUE NOT NULL,
  "first_name" varchar(50) NOT NULL,
  "last_name" varchar(50) NOT NULL,
  -- "avatar_url" text,
  "timezone" varchar(50) NOT NULL,
  -- "bio" text,
  "created_at" timestamptz DEFAULT (now()),
  "updated_at" timestamptz DEFAULT (now())
);

-- Language reference table (keep for scalability)
CREATE TABLE "languages" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "code" varchar(10) UNIQUE NOT NULL,
  -- e.g., en, es, fr
  "name" varchar(100) NOT NULL,
  -- e.g., English, Spanish
  "created_at" timestamptz DEFAULT (now()),
  "updated" timestamptz DEFAULT (now())
);

-- User language skills (simplified)
CREATE TABLE "user_languages" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "user_id" uuid NOT NULL REFERENCES "profiles" ("id") ON DELETE CASCADE,
  "language_id" uuid NOT NULL REFERENCES "languages" ("id"),
  "proficiency_level" varchar(20) NOT NULL,
  -- native, fluent, conversational, beginner
  "is_native" boolean DEFAULT false,
  "created_at" timestamptz DEFAULT (now()),
  "updated" timestamptz DEFAULT (now()),
  UNIQUE("user_id", "language_id")
);

-- Sessions table (simplified for 25 min sessions)
CREATE TABLE "sessions" ( -- take from here the fields only the ones you need
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "participant_one_id" uuid NOT NULL REFERENCES "profiles" ("id"),
  "participant_two_id" uuid NOT NULL REFERENCES "profiles" ("id"), -- make nullable, and then fill after it gets filled
  "language_one_id" uuid NOT NULL REFERENCES "languages" ("id"),
  -- P1's native language
  "language_two_id" uuid NOT NULL REFERENCES "languages" ("id"),
  -- P2's native language
  "start_time" timestamptz NOT NULL,
  "duration" integer DEFAULT 30,
  -- "status" varchar(20) DEFAULT 'scheduled',
  -- scheduled, active, completed, cancelled
  "room_url" text,
  "cancelled_by_user_id" uuid, -- add this to the table once you do 
  -- Track who cancelled
  "cancellation_time" timestamptz,
  "created_at" timestamptz DEFAULT (now()),
  "updated_at" timestamptz DEFAULT (now())
);

-- -- Session attendance tracking (for no-show detection)
-- CREATE TABLE "session_attendance" (
--   "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
--   "session_id" uuid NOT NULL REFERENCES "sessions" ("id") ON DELETE CASCADE,
--   "user_id" uuid NOT NULL REFERENCES "profiles" ("id"),
--   "joined_at" timestamptz,
--   "no_show" boolean DEFAULT false,
--   "left_at" timestamptz,
--   -- this will be an updatable field, everytime someone leaves a session we update this to keep track that people are leaving AFTER the session ends.
--   "created_at" timestamptz DEFAULT (now()),
--   "updated_at" timestamptz DEFAULT (now()),
--   UNIQUE("session_id", "user_id") -- means one user can only one attendance record per session, prevents duplicates.
-- );

-- Keep reports for safety
-- CREATE TABLE "user_reports" (
--   "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
--   "reporter_id" uuid NOT NULL REFERENCES "profiles" ("id"),
--   "reported_user_id" uuid NOT NULL REFERENCES "profiles" ("id"),
--   "session_id" uuid REFERENCES "sessions" ("id"),
--   "reason" varchar(20) NOT NULL,
--   -- fake, offensive, misconduct, other
--   "description" text,
--   "status" varchar(20) DEFAULT 'pending',
--   -- pending, reviewed, resolved
--   "created_at" timestamptz DEFAULT (now()),
--   "updated_at" timestamptz DEFAULT (now()),
--   CHECK (reporter_id != reported_user_id) -- just checks on creation to make sure reported_user_id does not equal reporter_id
-- );

-- for later... snoozes, favorites.

-- Indexes for performance
CREATE INDEX "idx_user_languages_user_id" ON "user_languages" ("user_id");

CREATE INDEX "idx_user_languages_language_id" ON "user_languages" ("language_id");

CREATE INDEX "idx_match_requests_status" ON "match_requests" ("status");

CREATE INDEX "idx_match_requests_user" ON "match_requests" ("user_id");

CREATE INDEX "idx_match_requests_languages" ON "match_requests" ("native_language_id", "learning_language_id");

CREATE INDEX "idx_match_requests_start_time" ON "match_requests" ("requested_start_time");

CREATE INDEX "idx_sessions_status" ON "sessions" ("status");

CREATE INDEX "idx_sessions_scheduled_start" ON "sessions" ("start_time");

CREATE INDEX "idx_sessions_participants" ON "sessions" ("participant_one_id", "participant_two_id");

CREATE INDEX "idx_session_attendance_session" ON "session_attendance" ("session_id");

CREATE INDEX "idx_session_attendance_user" ON "session_attendance" ("user_id");

CREATE INDEX "idx_user_reports_status" ON "user_reports" ("status");

INSERT INTO languages (code, name) VALUES 
('en', 'English'),
('es', 'Spanish');