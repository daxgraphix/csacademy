-- ============================================================
-- CSAcademy Seed Data
-- ============================================================

-- ============================================================
-- PROGRAMS
-- ============================================================
INSERT INTO programs (slug, title, description, category, icon, color, duration_days, xp_reward, is_featured, order_index) VALUES
('30-days-ai-tools', '30 Days of AI Tools', 'Master one powerful AI tool every day for 30 consecutive days. From ChatGPT to creative AI, become fluent in the tools shaping tomorrow.', 'ai_tools', '🤖', '#06B6D4', 30, 300, TRUE, 1),
('cybersecurity-awareness', 'Cybersecurity Awareness', 'Build essential cyber defenses. Learn to identify phishing, protect your accounts, and stay safe in an increasingly hostile digital world.', 'cybersecurity', '🛡️', '#7C3AED', 14, 200, TRUE, 2),
('ai-safety-responsible-ai', 'AI Safety & Responsible AI', 'Navigate AI ethics, deepfakes, and misinformation. Become a responsible digital citizen in the age of AI.', 'ai_safety', '⚖️', '#F59E0B', 10, 150, FALSE, 3),
('digital-skills-essentials', 'Digital Skills Essentials', 'Master productivity, online research, collaboration, and information literacy skills demanded by modern workplaces.', 'digital_skills', '💻', '#10B981', 10, 150, FALSE, 4);

-- ============================================================
-- MODULES for 30 Days of AI Tools
-- ============================================================
INSERT INTO modules (program_id, title, description, order_index, xp_reward) 
SELECT p.id, m.title, m.description, m.order_index, m.xp_reward
FROM programs p, (VALUES
  ('Week 1: Conversational AI', 'Master the foundation — text-based AI assistants', 1, 50),
  ('Week 2: Productivity & Presentation', 'AI tools for meetings, docs, and slides', 2, 50),
  ('Week 3: Code & Build', 'AI-powered development and creation tools', 3, 50),
  ('Week 4: Visual & Creative AI', 'Generate images, video, and audio with AI', 4, 50),
  ('Week 5+: Career & Business AI', 'AI tools for growth, marketing, and career', 5, 50)
) AS m(title, description, order_index, xp_reward)
WHERE p.slug = '30-days-ai-tools';

-- ============================================================
-- BADGES
-- ============================================================
INSERT INTO badges (slug, name, description, icon, color, category, rarity) VALUES
('first-lesson',     'First Step',         'Completed your very first lesson',                    '🎯', '#06B6D4', 'milestone',    'common'),
('first-quiz',       'Quiz Taker',         'Passed your first quiz',                              '📝', '#06B6D4', 'milestone',    'common'),
('streak-3',         '3-Day Streak',       'Learned 3 days in a row',                             '🔥', '#EF4444', 'streak',       'common'),
('streak-7',         'Week Warrior',       'Maintained a 7-day learning streak',                  '🔥', '#EF4444', 'streak',       'rare'),
('streak-14',        'Fortnight Flame',    'Kept learning for 14 consecutive days',               '🔥', '#F59E0B', 'streak',       'rare'),
('streak-30',        'Monthly Master',     'Achieved an incredible 30-day streak',                '🔥', '#8B5CF6', 'streak',       'epic'),
('streak-60',        '60-Day Legend',      'Two months of daily dedication — extraordinary',      '🔥', '#06B6D4', 'streak',       'legendary'),
('cyber-defender',   'Cyber Defender',     'Completed the Cybersecurity Awareness program',       '🛡️', '#7C3AED', 'completion',   'rare'),
('ai-explorer',      'AI Explorer',        'Started the 30 Days of AI Tools challenge',           '🚀', '#06B6D4', 'milestone',    'common'),
('ai-graduate',      'AI Graduate',        'Mastered all 30 AI tools — outstanding achievement',  '🎓', '#F59E0B', 'completion',   'epic'),
('digital-citizen',  'Digital Citizen',    'Completed AI Safety & Responsible AI',                '⚖️', '#10B981', 'completion',   'rare'),
('challenge-first',  'Challenge Accepted', 'Submitted your first challenge',                      '💪', '#10B981', 'milestone',    'common'),
('quiz-ace',         'Quiz Ace',           'Scored 100% on any quiz',                             '💯', '#F59E0B', 'achievement',  'rare'),
('speed-learner',    'Speed Learner',      'Completed a lesson in under 3 minutes',               '⚡', '#06B6D4', 'achievement',  'common'),
('top-performer',    'Top Performer',      'Reached the top 10 on the weekly leaderboard',        '🏆', '#F59E0B', 'achievement',  'epic'),
('helper',           'Community Helper',   'Received 10 likes on your community posts',           '🤝', '#10B981', 'community',    'rare'),
('xp-500',           'Rising Star',        'Earned 500 XP total',                                 '⭐', '#06B6D4', 'xp',           'common'),
('xp-1000',          'Power Learner',      'Earned 1,000 XP total',                               '🌟', '#F59E0B', 'xp',           'rare'),
('xp-5000',          'XP Champion',        'Earned an incredible 5,000 XP',                       '👑', '#8B5CF6', 'xp',           'legendary');

-- ============================================================
-- COMMUNITIES
-- ============================================================
INSERT INTO communities (slug, name, description, icon, is_public) VALUES
('general',             'General Discussion',       'A place for all learners to connect and share',                  '💬', TRUE),
('ai-tools',            'AI Tools Talk',            'Discuss the latest AI tools, tips, and tricks',                 '🤖', TRUE),
('cybersecurity',       'Cyber Defense',            'Share cybersecurity knowledge and stay updated on threats',      '🛡️', TRUE),
('30-day-challenge',    '30-Day Challenge Group',   'Support group for learners doing the AI Tools Challenge',        '🔥', TRUE),
('showcase',            'Project Showcase',         'Share your AI creations and challenge submissions',              '🎨', TRUE),
('q-and-a',             'Q&A',                     'Ask questions and get help from the community',                  '❓', TRUE);
