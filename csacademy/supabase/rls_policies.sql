-- ============================================================
-- CSAcademy Row Level Security Policies
-- ============================================================

ALTER TABLE profiles                ENABLE ROW LEVEL SECURITY;
ALTER TABLE programs                ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_cards            ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes                 ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions               ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenges              ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions             ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress           ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_program_progress   ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks            ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_transactions         ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges                  ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges             ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard_entries     ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates            ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificate_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE communities             ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_members       ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts                   ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes              ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments                ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications           ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations           ENABLE ROW LEVEL SECURITY;
ALTER TABLE organization_members    ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions           ENABLE ROW LEVEL SECURITY;

-- Helper function
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin');
$$;

CREATE OR REPLACE FUNCTION is_instructor_or_admin() RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role IN ('instructor', 'admin'));
$$;

-- ============================================================
-- PROFILES
-- ============================================================
CREATE POLICY "Profiles are publicly viewable"    ON profiles FOR SELECT USING (TRUE);
CREATE POLICY "Users can update own profile"      ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can update any profile"     ON profiles FOR UPDATE USING (is_admin());

-- ============================================================
-- PROGRAMS, MODULES, LESSONS (public read for published)
-- ============================================================
CREATE POLICY "Published programs are public"     ON programs     FOR SELECT USING (is_published = TRUE OR is_instructor_or_admin());
CREATE POLICY "Instructors manage programs"       ON programs     FOR ALL    USING (is_instructor_or_admin());
CREATE POLICY "Published modules are public"      ON modules      FOR SELECT USING (is_published = TRUE OR is_instructor_or_admin());
CREATE POLICY "Instructors manage modules"        ON modules      FOR ALL    USING (is_instructor_or_admin());
CREATE POLICY "Published lessons are public"      ON lessons      FOR SELECT USING (is_published = TRUE OR is_instructor_or_admin());
CREATE POLICY "Instructors manage lessons"        ON lessons      FOR ALL    USING (is_instructor_or_admin());
CREATE POLICY "Lesson cards publicly readable"    ON lesson_cards FOR SELECT USING (TRUE);
CREATE POLICY "Instructors manage lesson cards"   ON lesson_cards FOR ALL    USING (is_instructor_or_admin());
CREATE POLICY "Quizzes publicly readable"         ON quizzes      FOR SELECT USING (TRUE);
CREATE POLICY "Questions publicly readable"       ON questions    FOR SELECT USING (TRUE);
CREATE POLICY "Challenges publicly readable"      ON challenges   FOR SELECT USING (TRUE);

-- ============================================================
-- USER PROGRESS
-- ============================================================
CREATE POLICY "Users view own progress"           ON user_progress         FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own progress"         ON user_progress         FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own progress"         ON user_progress         FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users view own program progress"   ON user_program_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users upsert own program progress" ON user_program_progress FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "Instructors view all progress"     ON user_progress         FOR SELECT USING (is_instructor_or_admin());

-- ============================================================
-- STREAKS & XP
-- ============================================================
CREATE POLICY "Users view own streak"             ON user_streaks     FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own xp"                 ON xp_transactions  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Leaderboard is public"             ON leaderboard_entries FOR SELECT USING (TRUE);

-- ============================================================
-- BADGES
-- ============================================================
CREATE POLICY "Badges are public"                 ON badges      FOR SELECT USING (TRUE);
CREATE POLICY "User badges are public"            ON user_badges FOR SELECT USING (TRUE);
CREATE POLICY "Users earn badges"                 ON user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- SUBMISSIONS
-- ============================================================
CREATE POLICY "Users view own submissions"        ON submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users create submissions"          ON submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Instructors review submissions"    ON submissions FOR ALL    USING (is_instructor_or_admin());

-- ============================================================
-- CERTIFICATES
-- ============================================================
CREATE POLICY "Certificates are public"           ON certificates              FOR SELECT USING (TRUE);
CREATE POLICY "Certificate verifications public"  ON certificate_verifications FOR SELECT USING (TRUE);
CREATE POLICY "System inserts verifications"      ON certificate_verifications FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- COMMUNITY
-- ============================================================
CREATE POLICY "Public communities are viewable"   ON communities       FOR SELECT USING (is_public = TRUE OR auth.uid() IS NOT NULL);
CREATE POLICY "Members view membership"           ON community_members FOR SELECT USING (TRUE);
CREATE POLICY "Users join communities"            ON community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave communities"           ON community_members FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Posts in public communities"       ON posts             FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users post"          ON posts             FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users edit own posts"              ON posts             FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own posts"            ON posts             FOR DELETE USING (auth.uid() = user_id OR is_admin());
CREATE POLICY "Post likes are public"             ON post_likes        FOR SELECT USING (TRUE);
CREATE POLICY "Users like posts"                  ON post_likes        FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "Comments are public"               ON comments          FOR SELECT USING (TRUE);
CREATE POLICY "Authenticated users comment"       ON comments          FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users edit own comments"           ON comments          FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own comments"         ON comments          FOR DELETE USING (auth.uid() = user_id OR is_admin());

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE POLICY "Users view own notifications"      ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications"    ON notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System creates notifications"      ON notifications FOR INSERT WITH CHECK (TRUE);

-- ============================================================
-- ORGANIZATIONS
-- ============================================================
CREATE POLICY "Org members view org"              ON organizations        FOR SELECT USING (
  EXISTS (SELECT 1 FROM organization_members WHERE org_id = id AND user_id = auth.uid()) OR is_admin()
);
CREATE POLICY "Org members view membership"       ON organization_members FOR SELECT USING (
  EXISTS (SELECT 1 FROM organization_members WHERE org_id = org_id AND user_id = auth.uid()) OR is_admin()
);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE POLICY "Users view own subscription"       ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins manage subscriptions"       ON subscriptions FOR ALL    USING (is_admin());
