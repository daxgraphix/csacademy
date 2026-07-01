# CSAcademy 🎓

**AI Literacy, Cybersecurity & Digital Skills Micro-Learning Platform**

A gamified, mobile-first learning platform built with Next.js 15, TypeScript, Tailwind CSS, ShadCN UI, and Supabase. Features the flagship **30 Days of AI Tools Challenge**, a complete cybersecurity awareness program, XP/streak/badge gamification, and multi-portal architecture (Student / Instructor / Admin).

---

## ✨ Features

- **30 Days of AI Tools Challenge** — fully written curriculum covering ChatGPT, Gemini, Claude, Midjourney, Runway, Bolt.new, and 24 more tools, each with cards, quiz, and challenge
- **Cybersecurity Awareness** program with interactive labs (phishing, password, social engineering, deepfakes)
- **Gamification**: XP system, daily streaks, 19 unique badges, 7 levels, leaderboards
- **Certificates** with QR verification and a public verification flow
- **Community**: forums, posts, likes, comments across topic-based communities
- **Three portals**: Student, Instructor, Admin — each with dedicated dashboards, sidebars, and data views
- **Supabase backend**: full Postgres schema, RLS policies, Postgres functions (`award_xp`, `update_user_streak`, `issue_certificate`), and auto-profile-creation trigger

---

## 🧱 Tech Stack

| Layer        | Technology |
|--------------|------------|
| Framework    | Next.js 15 (App Router) |
| Language     | TypeScript |
| Styling      | Tailwind CSS + ShadCN UI (Radix primitives) |
| State        | Zustand (client) + TanStack Query (server cache) |
| Animation    | Framer Motion |
| Backend      | Supabase (Postgres, Auth, Storage, RLS) |
| Charts       | Recharts |
| Confetti     | canvas-confetti |

---

## 🚀 Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. In the SQL Editor, run the following files **in order**:
   - `supabase/schema.sql` — tables, enums, indexes, triggers, functions
   - `supabase/rls_policies.sql` — Row Level Security policies
   - `supabase/seed.sql` — seed programs, badges, communities, modules

> Note: the seed file does **not** include the 30 individual AI tool lessons in the database — those are served from `src/features/ai-tools/data.ts` as a fully-typed static dataset for fast iteration. To make them instructor-editable in the DB, insert them into `lessons` / `lesson_cards` / `quizzes` / `questions` / `challenges` following the schema, using the data file as your source of truth.

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:3000`.

### 5. (Optional) Enable Google OAuth

In Supabase Dashboard → Authentication → Providers → Google, add your OAuth credentials and set the redirect URL to:
```
https://<your-project>.supabase.co/auth/v1/callback
```

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (public)/          # Marketing site: home, programs, ai-tools, cybersecurity, pricing
│   ├── (auth)/             # Login, register
│   ├── student/            # Student portal (dashboard, ai-journey, cyber-academy, etc.)
│   ├── instructor/         # Instructor portal
│   ├── admin/               # Admin portal
│   └── api/                  # Route handlers (progress, leaderboard, certificates, auth callback)
├── components/
│   ├── ui/                  # ShadCN primitives (button, card, dialog, toast, etc.)
│   ├── layout/              # Navbar + role-based sidebars
│   ├── learning/            # LessonPlayer (swipeable cards + quiz + challenge)
│   ├── gamification/        # XPBar, StreakBadge, LevelBadge, BadgeGrid
│   └── certificates/        # CertificateCard
├── features/
│   └── ai-tools/data.ts     # Full 30-day AI tools curriculum (typed dataset)
├── hooks/                   # useAuth, useProgress, useGamification, useToast
├── stores/                  # Zustand: authStore, progressStore
├── lib/
│   ├── supabase/            # client.ts, server.ts, middleware.ts
│   ├── constants.ts
│   └── utils.ts
└── types/                   # database.ts (generated-style types), index.ts (app types)

supabase/
├── schema.sql
├── rls_policies.sql
└── seed.sql
```

---

## 🎮 Gamification Reference

| Action | XP |
|---|---|
| Lesson complete | 10 |
| Quiz pass | 20 |
| Challenge submit | 30 |
| Module complete | 50 |
| Program complete | 100 |
| Perfect quiz bonus | +10 |

**Levels**: 1 Beginner → 2 Explorer → 3 Learner → 4 Practitioner → 5 Specialist → 6 Expert → 7 Champion (500 XP per level)

**Streak milestones**: 3, 7, 14, 30, 60, 90 days — each unlocks a badge.

---

## 🔐 Roles

- **student** — default role, full learning access
- **instructor** — can create/manage programs, lessons, quizzes; views student reports
- **org_manager** — manages organization seats and team progress (schema in place; portal not yet built)
- **admin** — full platform access

Roles are set on `profiles.role` and enforced via RLS using the `is_admin()` / `is_instructor_or_admin()` Postgres functions.

---

## 📝 Notes & Next Steps

- The lesson player currently reads AI tool content from the static `data.ts` file rather than the database — this was a deliberate choice for v1 to ship the full 30-day curriculum without requiring 30+ rows of manual seeding. Swap `LessonPlayer`'s data source to Supabase queries once instructors are actively authoring content.
- Certificate PDF generation currently uses `window.print()` as a placeholder — wire up a proper PDF/image export (e.g. `html2canvas` + `jsPDF`, or a server-side renderer) for production.
- The QR code on certificates is a stylized placeholder grid — swap in the `qrcode` package (already in `package.json`) to generate a real scannable QR linking to the verification URL.
- Organization/enterprise portal pages are not yet built — the database schema (`organizations`, `organization_members`) is ready for this.

---

Built for CSAcademy — Africa-context, mobile-first, micro-learning for the AI era. 🚀
