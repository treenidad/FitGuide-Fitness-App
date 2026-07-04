
/*
# FitGuide Database Schema

## Overview
Single-tenant schema for FitGuide fitness app. No auth required — all data accessible via anon key.

## New Tables

### workout_sessions
Stores completed workout sessions with duration, calories, and metadata.
- id: uuid primary key
- workout_id: reference to the workout that was performed
- workout_name: display name of the workout
- started_at: session start timestamp
- completed_at: optional completion timestamp
- duration_minutes: total session duration
- total_volume: total weight lifted (lbs)
- calories_burned: estimated calories burned
- notes: optional session notes
- created_at: record creation timestamp

### custom_workouts
User-created workout definitions with exercise lists.
- id: uuid primary key
- name: workout name
- description: optional workout description
- exercises: JSON array of exercise configurations
- estimated_duration: expected workout length in minutes
- difficulty: Beginner/Intermediate/Advanced
- category: workout category label
- tags: JSON array of tags
- created_at / updated_at: timestamps

### user_profile
Single-row user profile table for the application user.
- id: text primary key (always 'default')
- name: display name
- age, weight_lbs, height_inches: body metrics
- fitness_goal: user's goal description
- experience_level: Beginner/Intermediate/Advanced
- workout_streak: current consecutive day streak
- total_workouts: lifetime workout count
- favorite_exercise_ids: JSON array of exercise IDs
- updated_at: last update timestamp

### personal_records
Best performances for each exercise.
- id: uuid primary key
- exercise_id: exercise identifier
- exercise_name: display name
- weight_lbs: weight achieved
- reps: reps achieved at that weight
- achieved_at: date of the record

## Security
- RLS enabled on all tables
- All policies grant full access to anon + authenticated (single-tenant, no user isolation)
*/

-- ── workout_sessions ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workout_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id text NOT NULL,
  workout_name text NOT NULL,
  started_at timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  duration_minutes integer NOT NULL DEFAULT 0,
  total_volume numeric NOT NULL DEFAULT 0,
  calories_burned integer NOT NULL DEFAULT 0,
  exercises jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_sessions" ON workout_sessions;
CREATE POLICY "anon_select_sessions" ON workout_sessions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_sessions" ON workout_sessions;
CREATE POLICY "anon_insert_sessions" ON workout_sessions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_sessions" ON workout_sessions;
CREATE POLICY "anon_update_sessions" ON workout_sessions FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_sessions" ON workout_sessions;
CREATE POLICY "anon_delete_sessions" ON workout_sessions FOR DELETE
  TO anon, authenticated USING (true);

-- ── custom_workouts ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS custom_workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id text NOT NULL,
  name text NOT NULL,
  description text,
  exercises jsonb NOT NULL DEFAULT '[]'::jsonb,
  estimated_duration integer NOT NULL DEFAULT 30,
  difficulty text NOT NULL DEFAULT 'Intermediate',
  category text NOT NULL DEFAULT 'Custom',
  tags jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE custom_workouts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_workouts" ON custom_workouts;
CREATE POLICY "anon_select_workouts" ON custom_workouts FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_workouts" ON custom_workouts;
CREATE POLICY "anon_insert_workouts" ON custom_workouts FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_workouts" ON custom_workouts;
CREATE POLICY "anon_update_workouts" ON custom_workouts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_workouts" ON custom_workouts;
CREATE POLICY "anon_delete_workouts" ON custom_workouts FOR DELETE
  TO anon, authenticated USING (true);

-- ── user_profile ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_profile (
  id text PRIMARY KEY DEFAULT 'default',
  name text NOT NULL DEFAULT 'FitGuide User',
  age integer DEFAULT 25,
  weight_lbs numeric DEFAULT 170,
  height_inches integer DEFAULT 68,
  fitness_goal text DEFAULT 'Get fit and healthy',
  experience_level text NOT NULL DEFAULT 'Intermediate',
  workout_streak integer NOT NULL DEFAULT 0,
  total_workouts integer NOT NULL DEFAULT 0,
  favorite_exercise_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE user_profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_profile" ON user_profile;
CREATE POLICY "anon_select_profile" ON user_profile FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_profile" ON user_profile;
CREATE POLICY "anon_insert_profile" ON user_profile FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_profile" ON user_profile;
CREATE POLICY "anon_update_profile" ON user_profile FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

-- ── personal_records ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS personal_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_id text NOT NULL,
  exercise_name text NOT NULL,
  weight_lbs numeric NOT NULL DEFAULT 0,
  reps integer NOT NULL DEFAULT 1,
  achieved_at date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(exercise_id)
);

ALTER TABLE personal_records ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_prs" ON personal_records;
CREATE POLICY "anon_select_prs" ON personal_records FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_prs" ON personal_records;
CREATE POLICY "anon_insert_prs" ON personal_records FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_prs" ON personal_records;
CREATE POLICY "anon_update_prs" ON personal_records FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_prs" ON personal_records;
CREATE POLICY "anon_delete_prs" ON personal_records FOR DELETE
  TO anon, authenticated USING (true);

-- ── Indexes ──────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_sessions_started_at ON workout_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_prs_exercise_id ON personal_records(exercise_id);
CREATE INDEX IF NOT EXISTS idx_workouts_client_id ON custom_workouts(client_id);
