CREATE TABLE "sessions" ( -- take from here the fields only the ones you need
  "id" uuid PRIMARY KEY DEFAULT (gen_random_uuid()),
  "user_one_id" uuid NOT NULL REFERENCES "profiles" ("id"),
  "user_two_id" uuid REFERENCES "profiles" ("id"), -- make nullable, and then fill after it gets filled
  "language_one_id" uuid NOT NULL REFERENCES "languages" ("id"),
  -- P1's native language
  "language_two_id" uuid NOT NULL REFERENCES "languages" ("id"),
  -- P2's native language
  "start_time" timestamptz NOT NULL,
  -- "duration" integer DEFAULT 30,
  "status" varchar(20) DEFAULT 'scheduled',
  -- scheduled, active, finished, cancelled (enum potentially here) "room_url" text, (could be used later)
  -- "cancelled_by_user_id" uuid, -- add this to the table once you do, track who cancelled
  -- "cancellation_time" timestamptz,
  "created_at" timestamptz DEFAULT (now()),
  "updated_at" timestamptz DEFAULT (now())
);

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS trigger AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_sessions_updated_at
  BEFORE UPDATE ON public.sessions
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
