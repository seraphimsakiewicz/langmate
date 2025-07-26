Project langmate_app {
  database_type: 'PostgreSQL'
  Note: 'Langmate SQL DMBL Schema'
}

// Core entities first
Table users {
  id uuid [primary key, default: `uuid_generate_v4()`]
  email varchar(255) [unique, not null]
  username varchar(50) [unique, not null]
  full_name varchar(100)
  avatar_url text
  timezone varchar(50)
  bio text
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
  
}

Table languages {
  id uuid [primary key, default: `uuid_generate_v4()`]
  code varchar(10) [unique, not null, note: 'e.g., en, es, fr']
  name varchar(100) [not null, note: 'e.g., English, Spanish, French']
  native_name varchar(100) [note: 'e.g., English, Español, Français']
  created_at timestamptz [default: `now()`]
}

// Junction table for many-to-many relationship
Table user_languages {
  id uuid [primary key, default: `uuid_generate_v4()`]
  user_id uuid [not null, ref: > users.id]
  language_id uuid [not null, ref: > languages.id]
  proficiency_level varchar(20) [note: 'native, fluent, conversational, beginner']
  is_native boolean [default: false]
  created_at timestamptz [default: `now()`]
  
  Indexes {
    user_id [name: 'idx_user_languages_user_id']
    language_id [name: 'idx_user_languages_language_id']
    is_native [name: 'idx_user_languages_native', note: 'Partial index: WHERE is_native = true']
    (user_id, language_id) [unique]
  }
}

// Main sessions table - for language exchange matchmaking
Table sessions {
  id uuid [primary key, default: `uuid_generate_v4()`]
  participant_one_id uuid [not null, ref: > users.id]
  participant_two_id uuid [ref: > users.id]
  language_one_id uuid [not null, ref: > languages.id, note: 'First language in exchange']
  language_two_id uuid [not null, ref: > languages.id, note: 'Second language in exchange']
  duration_minutes integer [not null, default: 60, note: 'Total session duration (e.g., 20, 40, 60 minutes)']
  start_time timestamptz [note: 'Set when both participants join, null during matching']
  end_time timestamptz [note: 'Calculated based on session duration']
  status varchar(20) [default: 'waiting_for_participants', note: 'waiting_for_participants, active, completed, cancelled, no_show']
  room_url text [note: 'For video call integration']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
  
  Indexes {
    status [name: 'idx_sessions_status']
    start_time [name: 'idx_sessions_start_time']
    language_one_id [name: 'idx_sessions_language_one_id']
    language_two_id [name: 'idx_sessions_language_two_id']
    participant_one_id [name: 'idx_sessions_participant_one_id']
    participant_two_id [name: 'idx_sessions_participant_two_id']
    created_at [name: 'idx_sessions_created_at']
  }
}

// Personal session notes - for future use (Phase 1+)
/* Table user_sessions {
  id uuid [primary key, default: `uuid_generate_v4()`]
  user_id uuid [not null, ref: > users.id]
  session_id uuid [not null, ref: > sessions.id]
  title varchar(200) [note: 'Personal title for this session']
  description text [note: 'Personal notes about the session']
  created_at timestamptz [default: `now()`]
  updated_at timestamptz [default: `now()`]
  
  Indexes {
    (user_id, session_id) [unique]
    user_id [name: 'idx_user_sessions_user_id']
    session_id [name: 'idx_user_sessions_session_id']
  }
} */

// User interaction tables
Table user_favorites {
  id uuid [primary key, default: `uuid_generate_v4()`]
  user_id uuid [not null, ref: > users.id]
  favorited_user_id uuid [not null, ref: > users.id]
  created_at timestamptz [default: `now()`]
  
  Indexes {
    (user_id, favorited_user_id) [unique]
    user_id [name: 'idx_user_favorites_user_id']
  }
  
  Note: 'Users can favorite other users. Check constraint: user_id != favorited_user_id'
}

Table user_reports {
  id uuid [primary key, default: `uuid_generate_v4()`]
  reporter_id uuid [not null, ref: > users.id]
  reported_user_id uuid [not null, ref: > users.id]
  session_id uuid [ref: > sessions.id, note: 'Optional reference to the session where incident occurred']
  reason varchar(50) [not null, note: 'inappropriate_behavior, no_show, disruptive, spam, harassment, other']
  description text
  status varchar(20) [default: 'pending', note: 'pending, reviewed, resolved, dismissed']
  created_at timestamptz [default: `now()`]
  
  Indexes {
    reporter_id [name: 'idx_user_reports_reporter_id']
    reported_user_id [name: 'idx_user_reports_reported_user_id']
    status [name: 'idx_user_reports_status']
  }
  
  Note: 'Users can report other users. Check constraint: reporter_id != reported_user_id'
}

Table user_snoozes {
  id uuid [primary key, default: `uuid_generate_v4()`]
  user_id uuid [not null, ref: > users.id]
  snoozed_user_id uuid [not null, ref: > users.id]
  expires_at timestamptz [not null]
  reason varchar(50) [note: 'not_compatible, break_needed, temporary_hide, other']
  created_at timestamptz [default: `now()`]
  
  Indexes {
    expires_at [name: 'idx_user_snoozes_expires']
    (user_id, snoozed_user_id) [unique]
    user_id [name: 'idx_user_snoozes_user_id']
  }
  
  Note: 'Temporarily hide users. Check constraint: user_id != snoozed_user_id'
}