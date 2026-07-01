-- ============================================================
-- CSAcademy Database Schema v1.0
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- ENUMS
-- ============================================================

CREATE TYPE user_role AS ENUM ('student', 'instructor', 'org_manager', 'admin');
CREATE TYPE program_category AS ENUM ('ai_tools', 'cybersecurity', 'ai_safety', 'digital_skills');
CREATE TYPE lesson_type AS ENUM ('standard', 'lab', 'challenge');
CREATE TYPE quiz_type AS ENUM ('multiple_choice', 'true_false', 'scenario');
CREATE TYPE submission_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE certificate_status AS ENUM ('issued', 'revoked');
CREATE TYPE subscription_plan AS ENUM ('free', 'pro', 'enterprise');
CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');

-- ============================================================
-- USERS & PROFILES
-- ============================================================

CREATE TABLE profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         TEXT NOT NULL UNIQUE,
  full_name     TEXT NOT NULL DEFAULT '',
  username      TEXT UNIQUE,
  avatar_url    TEXT,
  bio           TEXT,
  role          user_role NOT NULL DEFAULT 'student',
  country       TEXT DEFAULT 'TZ',
  institution   TEXT,
  occupation    TEXT,
  subscription  subscription_plan NOT NULL DEFAULT 'free',
  total_xp      INTEGER NOT NULL DEFAULT 0,
  current_level INTEGER NOT NULL DEFAULT 1,
  streak_days   INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_active_at TIMESTAMPTZ,
  onboarded     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- PROGRAMS & COURSES
-- ============================================================

CREATE TABLE programs (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT NOT NULL UNIQUE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  category    program_category NOT NULL,
  icon        TEXT NOT NULL DEFAULT '🎓',
  color       TEXT NOT NULL DEFAULT '#06B6D4',
  thumbnail   TEXT,
  duration_days INTEGER NOT NULL DEFAULT 30,
  xp_reward   INTEGER NOT NULL DEFAULT 100,
  is_featured BOOLEAN NOT NULL DEFAULT FALSE,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE modules (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  program_id  UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  xp_reward   INTEGER NOT NULL DEFAULT 50,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE lessons (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  module_id    UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  program_id   UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  slug         TEXT NOT NULL,
  description  TEXT,
  lesson_type  lesson_type NOT NULL DEFAULT 'standard',
  day_number   INTEGER,
  tool_name    TEXT,
  tool_icon    TEXT,
  tool_url     TEXT,
  estimated_minutes INTEGER NOT NULL DEFAULT 5,
  xp_reward    INTEGER NOT NULL DEFAULT 10,
  order_index  INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT TRUE,
  is_free      BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(module_id, slug)
);

CREATE TABLE lesson_cards (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  card_type    TEXT NOT NULL DEFAULT 'info',  -- info, feature, use_case, tip, warning
  title        TEXT NOT NULL,
  content      TEXT NOT NULL,
  media_url    TEXT,
  order_index  INTEGER NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- QUIZZES & QUESTIONS
-- ============================================================

CREATE TABLE quizzes (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id   UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title       TEXT NOT NULL DEFAULT 'Quick Check',
  pass_score  INTEGER NOT NULL DEFAULT 70,
  xp_reward   INTEGER NOT NULL DEFAULT 20,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE questions (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  quiz_id       UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  quiz_type     quiz_type NOT NULL DEFAULT 'multiple_choice',
  question_text TEXT NOT NULL,
  options       JSONB NOT NULL DEFAULT '[]',  -- [{id, text, is_correct}]
  explanation   TEXT,
  order_index   INTEGER NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- CHALLENGES
-- ============================================================

CREATE TABLE challenges (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lesson_id    UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  title        TEXT NOT NULL,
  description  TEXT NOT NULL,
  instructions TEXT NOT NULL,
  xp_reward    INTEGER NOT NULL DEFAULT 30,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE submissions (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content      TEXT,
  file_url     TEXT,
  status       submission_status NOT NULL DEFAULT 'pending',
  feedback     TEXT,
  reviewed_by  UUID REFERENCES profiles(id),
  reviewed_at  TIMESTAMPTZ,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(challenge_id, user_id)
);

-- ============================================================
-- USER PROGRESS
-- ============================================================

CREATE TABLE user_progress (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lesson_id   UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  program_id  UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  completed   BOOLEAN NOT NULL DEFAULT FALSE,
  score       INTEGER,              -- quiz score 0-100
  time_spent  INTEGER DEFAULT 0,   -- seconds
  completed_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE user_program_progress (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  program_id      UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  lessons_completed INTEGER NOT NULL DEFAULT 0,
  total_lessons   INTEGER NOT NULL DEFAULT 0,
  current_day     INTEGER NOT NULL DEFAULT 1,
  completed       BOOLEAN NOT NULL DEFAULT FALSE,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at    TIMESTAMPTZ,
  UNIQUE(user_id, program_id)
);

-- ============================================================
-- STREAKS
-- ============================================================

CREATE TABLE user_streaks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  streak_frozen  BOOLEAN NOT NULL DEFAULT FALSE,
  freeze_used_at TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- XP & GAMIFICATION
-- ============================================================

CREATE TABLE xp_transactions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount      INTEGER NOT NULL,
  source_type TEXT NOT NULL,  -- lesson, quiz, challenge, module, program, streak, bonus
  source_id   UUID,
  description TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE badges (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT NOT NULL,
  icon        TEXT NOT NULL,
  color       TEXT NOT NULL DEFAULT '#06B6D4',
  xp_required INTEGER DEFAULT 0,
  category    TEXT NOT NULL DEFAULT 'achievement',
  rarity      TEXT NOT NULL DEFAULT 'common',  -- common, rare, epic, legendary
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_badges (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id   UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

-- ============================================================
-- LEADERBOARDS
-- ============================================================

CREATE TABLE leaderboard_entries (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  period     TEXT NOT NULL DEFAULT 'all_time',  -- daily, weekly, monthly, all_time
  xp_total   INTEGER NOT NULL DEFAULT 0,
  rank_position INTEGER,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, period)
);

-- ============================================================
-- CERTIFICATES
-- ============================================================

CREATE TABLE certificates (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_id  TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(8), 'hex'),
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  program_id      UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
  status          certificate_status NOT NULL DEFAULT 'issued',
  issued_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at      TIMESTAMPTZ,
  metadata        JSONB DEFAULT '{}',
  UNIQUE(user_id, program_id)
);

CREATE TABLE certificate_verifications (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  certificate_id TEXT NOT NULL REFERENCES certificates(certificate_id),
  verified_by_ip TEXT,
  verified_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- COMMUNITY
-- ============================================================

CREATE TABLE communities (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  icon        TEXT DEFAULT '💬',
  cover_url   TEXT,
  program_id  UUID REFERENCES programs(id),
  is_public   BOOLEAN NOT NULL DEFAULT TRUE,
  member_count INTEGER NOT NULL DEFAULT 0,
  post_count  INTEGER NOT NULL DEFAULT 0,
  created_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE community_members (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role         TEXT NOT NULL DEFAULT 'member',
  joined_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(community_id, user_id)
);

CREATE TABLE posts (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  community_id UUID NOT NULL REFERENCES communities(id) ON DELETE CASCADE,
  user_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title        TEXT,
  content      TEXT NOT NULL,
  media_urls   JSONB DEFAULT '[]',
  likes_count  INTEGER NOT NULL DEFAULT 0,
  reply_count  INTEGER NOT NULL DEFAULT 0,
  is_pinned    BOOLEAN NOT NULL DEFAULT FALSE,
  is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE post_likes (
  id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  UNIQUE(post_id, user_id)
);

CREATE TABLE comments (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id     UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  parent_id   UUID REFERENCES comments(id),
  content     TEXT NOT NULL,
  likes_count INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================

CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,
  title       TEXT NOT NULL,
  message     TEXT,
  data        JSONB DEFAULT '{}',
  is_read     BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ORGANIZATIONS (Enterprise)
-- ============================================================

CREATE TABLE organizations (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  domain      TEXT,
  logo_url    TEXT,
  plan        subscription_plan NOT NULL DEFAULT 'enterprise',
  seats_limit INTEGER NOT NULL DEFAULT 50,
  seats_used  INTEGER NOT NULL DEFAULT 0,
  created_by  UUID REFERENCES profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE organization_members (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id          UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id         UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role            TEXT NOT NULL DEFAULT 'member',
  invited_by      UUID REFERENCES profiles(id),
  joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(org_id, user_id)
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================

CREATE TABLE subscriptions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  plan        subscription_plan NOT NULL DEFAULT 'free',
  status      subscription_status NOT NULL DEFAULT 'active',
  started_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at  TIMESTAMPTZ,
  payment_ref TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX idx_profiles_role      ON profiles(role);
CREATE INDEX idx_profiles_total_xp  ON profiles(total_xp DESC);
CREATE INDEX idx_user_progress_user ON user_progress(user_id);
CREATE INDEX idx_user_progress_prog ON user_progress(program_id);
CREATE INDEX idx_xp_transactions    ON xp_transactions(user_id, created_at DESC);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_posts_community    ON posts(community_id, created_at DESC);
CREATE INDEX idx_leaderboard        ON leaderboard_entries(period, xp_total DESC);
CREATE INDEX idx_certificates_user  ON certificates(user_id);
CREATE INDEX idx_lessons_program    ON lessons(program_id, day_number);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  INSERT INTO public.user_streaks (user_id) VALUES (NEW.id);
  INSERT INTO public.leaderboard_entries (user_id, period) VALUES
    (NEW.id, 'all_time'),
    (NEW.id, 'monthly'),
    (NEW.id, 'weekly');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update profile updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$;

CREATE TRIGGER trg_profiles_updated_at  BEFORE UPDATE ON profiles    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_lessons_updated_at   BEFORE UPDATE ON lessons     FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_programs_updated_at  BEFORE UPDATE ON programs    FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER trg_progress_updated_at  BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Award XP and update level
CREATE OR REPLACE FUNCTION award_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_source_type TEXT,
  p_source_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
) RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  new_total INTEGER;
  new_level INTEGER;
BEGIN
  INSERT INTO xp_transactions (user_id, amount, source_type, source_id, description)
  VALUES (p_user_id, p_amount, p_source_type, p_source_id, p_description);

  UPDATE profiles
  SET total_xp = total_xp + p_amount,
      last_active_at = NOW()
  WHERE id = p_user_id
  RETURNING total_xp INTO new_total;

  -- Calculate level (every 500 XP = 1 level, max 7)
  new_level := LEAST(7, FLOOR(new_total / 500) + 1);
  UPDATE profiles SET current_level = new_level WHERE id = p_user_id;

  -- Update leaderboards
  UPDATE leaderboard_entries
  SET xp_total = xp_total + p_amount, updated_at = NOW()
  WHERE user_id = p_user_id;

  RETURN new_total;
END;
$$;

-- Update streak
CREATE OR REPLACE FUNCTION update_user_streak(p_user_id UUID)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  last_date DATE;
  today DATE := CURRENT_DATE;
  current INTEGER;
BEGIN
  SELECT last_activity_date, current_streak
  INTO last_date, current
  FROM user_streaks WHERE user_id = p_user_id;

  IF last_date IS NULL OR last_date < today - INTERVAL '1 day' THEN
    -- Streak broken or first day
    IF last_date = today - INTERVAL '1 day' THEN
      current := current + 1;
    ELSE
      current := 1;
    END IF;
  ELSIF last_date = today THEN
    -- Already updated today
    RETURN current;
  END IF;

  UPDATE user_streaks
  SET current_streak = current,
      longest_streak = GREATEST(longest_streak, current),
      last_activity_date = today,
      updated_at = NOW()
  WHERE user_id = p_user_id;

  UPDATE profiles
  SET streak_days = current,
      longest_streak = GREATEST(longest_streak, current)
  WHERE id = p_user_id;

  RETURN current;
END;
$$;

-- Issue certificate on program completion
CREATE OR REPLACE FUNCTION issue_certificate(p_user_id UUID, p_program_id UUID)
RETURNS TEXT LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  cert_id TEXT;
BEGIN
  INSERT INTO certificates (user_id, program_id)
  VALUES (p_user_id, p_program_id)
  ON CONFLICT (user_id, program_id) DO NOTHING
  RETURNING certificate_id INTO cert_id;
  RETURN cert_id;
END;
$$;
