CREATE TABLE public.profiles (
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