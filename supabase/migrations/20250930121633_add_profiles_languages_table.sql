CREATE TABLE public.profiles (
  "id" uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  "email" varchar(255) UNIQUE NOT NULL,
  "first_name" varchar(50) NOT NULL,
  "last_name" varchar(50) NOT NULL,
  "timezone" varchar(50) NOT NULL,
  "created_at" timestamptz DEFAULT (now()),
  "updated_at" timestamptz DEFAULT (now()),
  "native_language_id" uuid NOT NULL REFERENCES public.languages("id"),
  "target_language_id" uuid NOT NULL REFERENCES public.languages("id"),
  "target_level" varchar(20) NOT NULL CHECK (target_level IN ('beginner', 'intermediate', 'advanced'))
);

CREATE TABLE public.languages (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "code" varchar(10) UNIQUE NOT NULL,  -- e.g., en, es, fr
  "name" varchar(30) NOT NULL,   -- e.g., English, Spanish
  "created_at" timestamptz DEFAULT (now()),
  "updated" timestamptz DEFAULT (now())
);

-- Seed initial languages
INSERT INTO public.languages (code, name) VALUES
  ('en', 'English'),
  ('es', 'Spanish')
ON CONFLICT (code) DO NOTHING;