CREATE TABLE public.languages (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "code" varchar(10) UNIQUE NOT NULL,
  -- e.g., en, es, fr
  "name" varchar(100) NOT NULL,
  -- e.g., English, Spanish
  "created_at" timestamptz DEFAULT (now()),
  "updated" timestamptz DEFAULT (now())
);


CREATE TABLE public.user_languages (
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_id" uuid NOT NULL REFERENCES public.profiles ("id") ON DELETE CASCADE,
  "language_id" uuid NOT NULL REFERENCES public.languages ("id"),
  "proficiency_level" varchar(20) NOT NULL,
  -- native, fluent, conversational, beginner
  "created_at" timestamptz DEFAULT (now()),
  "updated" timestamptz DEFAULT (now()),
  UNIQUE("user_id", "language_id")
);

-- Seed initial languages
INSERT INTO public.languages (code, name) VALUES
  ('en', 'English'),
  ('es', 'Spanish')
ON CONFLICT (code) DO NOTHING;