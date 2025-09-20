CREATE TABLE "profiles" (
  "id" uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "email" varchar(255) UNIQUE NOT NULL,
  "first_name" varchar(50) NOT NULL,
  "last_name" varchar(50) NOT NULL,
  "timezone" varchar(50) NOT NULL,
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