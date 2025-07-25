-- SQL dump generated using DBML (dbml.dbdiagram.io)
-- Database: PostgreSQL
-- Generated at: 2025-07-22T16:21:11.129Z

CREATE TABLE "profiles" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "email" varchar(255) UNIQUE NOT NULL,
  "username" varchar(50) UNIQUE NOT NULL,
  "full_name" varchar(100),
  "avatar_url" text,
  "timezone" varchar(50),
  "bio" text,
  "created_at" timestamptz DEFAULT (now()),
  "updated_at" timestamptz DEFAULT (now())
);

CREATE TABLE "languages" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "code" varchar(10) UNIQUE NOT NULL,
  "name" varchar(100) NOT NULL,
  "native_name" varchar(100),
  "created_at" timestamptz DEFAULT (now())
);

CREATE TABLE "user_languages" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "user_id" uuid NOT NULL,
  "language_id" uuid NOT NULL,
  "proficiency_level" varchar(20),
  "is_native" boolean DEFAULT false,
  "created_at" timestamptz DEFAULT (now())
);

CREATE TABLE "sessions" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "participant_one_id" uuid NOT NULL,
  "participant_two_id" uuid,
  "language_one_id" uuid NOT NULL,
  "language_two_id" uuid NOT NULL,
  "duration_minutes" integer NOT NULL DEFAULT 60,
  "start_time" timestamptz,
  "end_time" timestamptz,
  "status" varchar(20) DEFAULT 'waiting_for_participants',
  "room_url" text,
  "created_at" timestamptz DEFAULT (now()),
  "updated_at" timestamptz DEFAULT (now())
);

CREATE TABLE "user_favorites" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "user_id" uuid NOT NULL,
  "favorited_user_id" uuid NOT NULL,
  "created_at" timestamptz DEFAULT (now())
);

CREATE TABLE "user_reports" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "reporter_id" uuid NOT NULL,
  "reported_user_id" uuid NOT NULL,
  "session_id" uuid,
  "reason" varchar(50) NOT NULL,
  "description" text,
  "status" varchar(20) DEFAULT 'pending',
  "created_at" timestamptz DEFAULT (now())
);

CREATE TABLE "user_snoozes" (
  "id" uuid PRIMARY KEY DEFAULT (uuid_generate_v4()),
  "user_id" uuid NOT NULL,
  "snoozed_user_id" uuid NOT NULL,
  "expires_at" timestamptz NOT NULL,
  "reason" varchar(50),
  "created_at" timestamptz DEFAULT (now())
);

CREATE INDEX "idx_user_languages_user_id" ON "user_languages" ("user_id");

CREATE INDEX "idx_user_languages_language_id" ON "user_languages" ("language_id");

CREATE INDEX "idx_user_languages_native" ON "user_languages" ("is_native");

CREATE UNIQUE INDEX ON "user_languages" ("user_id", "language_id");

CREATE INDEX "idx_sessions_status" ON "sessions" ("status");

CREATE INDEX "idx_sessions_start_time" ON "sessions" ("start_time");

CREATE INDEX "idx_sessions_language_one_id" ON "sessions" ("language_one_id");

CREATE INDEX "idx_sessions_language_two_id" ON "sessions" ("language_two_id");

CREATE INDEX "idx_sessions_participant_one_id" ON "sessions" ("participant_one_id");

CREATE INDEX "idx_sessions_participant_two_id" ON "sessions" ("participant_two_id");

CREATE INDEX "idx_sessions_created_at" ON "sessions" ("created_at");

CREATE UNIQUE INDEX ON "user_favorites" ("user_id", "favorited_user_id");

CREATE INDEX "idx_user_favorites_user_id" ON "user_favorites" ("user_id");

CREATE INDEX "idx_user_reports_reporter_id" ON "user_reports" ("reporter_id");

CREATE INDEX "idx_user_reports_reported_user_id" ON "user_reports" ("reported_user_id");

CREATE INDEX "idx_user_reports_status" ON "user_reports" ("status");

CREATE INDEX "idx_user_snoozes_expires" ON "user_snoozes" ("expires_at");

CREATE UNIQUE INDEX ON "user_snoozes" ("user_id", "snoozed_user_id");

CREATE INDEX "idx_user_snoozes_user_id" ON "user_snoozes" ("user_id");

COMMENT ON COLUMN "languages"."code" IS 'e.g., en, es, fr';

COMMENT ON COLUMN "languages"."name" IS 'e.g., English, Spanish, French';

COMMENT ON COLUMN "languages"."native_name" IS 'e.g., English, Español, Français';

COMMENT ON COLUMN "user_languages"."proficiency_level" IS 'native, fluent, conversational, beginner';

COMMENT ON COLUMN "sessions"."language_one_id" IS 'First language in exchange';

COMMENT ON COLUMN "sessions"."language_two_id" IS 'Second language in exchange';

COMMENT ON COLUMN "sessions"."duration_minutes" IS 'Total session duration (e.g., 20, 40, 60 minutes)';

COMMENT ON COLUMN "sessions"."start_time" IS 'Set when both participants join, null during matching';

COMMENT ON COLUMN "sessions"."end_time" IS 'Calculated based on session duration';

COMMENT ON COLUMN "sessions"."status" IS 'waiting_for_participants, active, completed, cancelled, no_show';

COMMENT ON COLUMN "sessions"."room_url" IS 'For video call integration';

COMMENT ON TABLE "user_favorites" IS 'Users can favorite other users. Check constraint: user_id != favorited_user_id';

COMMENT ON TABLE "user_reports" IS 'Users can report other users. Check constraint: reporter_id != reported_user_id';

COMMENT ON COLUMN "user_reports"."session_id" IS 'Optional reference to the session where incident occurred';

COMMENT ON COLUMN "user_reports"."reason" IS 'inappropriate_behavior, no_show, disruptive, spam, harassment, other';

COMMENT ON COLUMN "user_reports"."status" IS 'pending, reviewed, resolved, dismissed';

COMMENT ON TABLE "user_snoozes" IS 'Temporarily hide users. Check constraint: user_id != snoozed_user_id';

COMMENT ON COLUMN "user_snoozes"."reason" IS 'not_compatible, break_needed, temporary_hide, other';

ALTER TABLE "user_languages" ADD FOREIGN KEY ("user_id") REFERENCES "profiles" ("id");

ALTER TABLE "user_languages" ADD FOREIGN KEY ("language_id") REFERENCES "languages" ("id");

ALTER TABLE "sessions" ADD FOREIGN KEY ("participant_one_id") REFERENCES "profiles" ("id");

ALTER TABLE "sessions" ADD FOREIGN KEY ("participant_two_id") REFERENCES "profiles" ("id");

ALTER TABLE "sessions" ADD FOREIGN KEY ("language_one_id") REFERENCES "languages" ("id");

ALTER TABLE "sessions" ADD FOREIGN KEY ("language_two_id") REFERENCES "languages" ("id");

ALTER TABLE "user_favorites" ADD FOREIGN KEY ("user_id") REFERENCES "profiles" ("id");

ALTER TABLE "user_favorites" ADD FOREIGN KEY ("favorited_user_id") REFERENCES "profiles" ("id");

ALTER TABLE "user_reports" ADD FOREIGN KEY ("reporter_id") REFERENCES "profiles" ("id");

ALTER TABLE "user_reports" ADD FOREIGN KEY ("reported_user_id") REFERENCES "profiles" ("id");

ALTER TABLE "user_reports" ADD FOREIGN KEY ("session_id") REFERENCES "sessions" ("id");

ALTER TABLE "user_snoozes" ADD FOREIGN KEY ("user_id") REFERENCES "profiles" ("id");

ALTER TABLE "user_snoozes" ADD FOREIGN KEY ("snoozed_user_id") REFERENCES "profiles" ("id");
