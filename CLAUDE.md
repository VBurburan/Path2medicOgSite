# CLAUDE.md — Path2Medic Development Guide

This file provides context for Claude Code when working in this repository.

---

## Project Overview

**Path2Medic** is an NREMT exam prep platform with two revenue tracks:
1. **1-on-1 Diagnostic Coaching** — Pretest → Vincent reviews → Zoom coaching → Post-test → Comparative results. This is the PRIMARY product.
2. **Practice Question Bank** — $19/mo (Pro) or $39/mo (Max) subscription for self-study. This is the GROWTH revenue stream.

Many students are both coaching clients and subscribers.

---

## Tech Stack

- **Framework:** Vite + React 18 + TypeScript
- **Styling:** Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- **Routing:** React Router v6
- **Backend:** Supabase (Auth, Database, Storage)
- **Charts:** Recharts (for domain comparison charts)
- **Icons:** Lucide React
- **Toast:** Sonner
- **Hosting:** Vercel (auto-deploys from `main` branch)
- **Grading Pipeline:** N8N webhooks → Claude API → Supabase writes → Email

---

## Key Directories

```
src/
├── app/
│   ├── components/       # Reusable UI components
│   │   ├── portal/       # Dashboard layout, sidebar
│   │   └── ui/           # Primitives (Button, Card, Badge, etc.)
│   ├── context/          # AuthContext (Supabase auth provider)
│   ├── pages/            # All route pages
│   │   ├── instructor/   # B2B instructor dashboard (scaffolded)
│   │   └── *.tsx         # Student portal + marketing pages
│   └── App.tsx           # Router config
├── assets/               # Static images (logo, covers, headshot)
├── utils/
│   └── supabaseClient.ts # Supabase client initialization
└── main.tsx              # App entry point
```

---

## Environment Variables

Required in `.env` (local) and Vercel dashboard (production):

```
VITE_SUPABASE_URL=https://kbfolxwbrjpajylkphwl.supabase.co
VITE_SUPABASE_ANON_KEY=<get from Supabase dashboard>
```

---

## Supabase Database

**Project:** `kbfolxwbrjpajylkphwl`

### Core Tables
| Table | Purpose |
|-------|---------|
| `students` | Student profiles linked to `auth.users.id` |
| `exam_assignments` | Coaching exams assigned by Vincent |
| `intake_submissions` | Pretest exam submissions + domain_breakdown |
| `posttest_submissions` | Post-test submissions + domain_breakdown |
| `exam_sessions` | Practice question session results |
| `student_question_history` | Individual question attempts (mastery tracking) |
| `questions` | Question bank (MC, MR, BL, DD, OB, Graphics) |
| `domains` | Domain list by certification level |
| `exam_answer_keys` | Answer keys for formal exams |

### Important Notes
- **RLS is enabled on all tables.** For anonymous inserts: use `CREATE POLICY WITH CHECK (true)` AND `GRANT INSERT, SELECT TO anon`. Missing the GRANT causes 401 errors.
- **Certification levels:** `EMT`, `AEMT`, `Paramedic`
- **Membership tiers:** `free`, `pro`, `max` (stored in `students.membership_tier`)
- **Mastery tracking:** 3 consecutive correct answers → `is_mastered = true` → deprioritize in future sessions. Student never sees this.

---

## Student Portal Routes

### Protected (require auth)
| Route | Page | Purpose |
|-------|------|---------|
| `/dashboard` | DashboardPage | Single contextual message + status line |
| `/exams` | ExamsPage | Coaching exam assignments with status badges |
| `/practice` | PracticePage | Practice config (gated behind subscription) |
| `/practice/session` | PracticeSessionPage | Active practice session (1 question per screen) |
| `/practice/results` | PracticeResultsPage | Session results + domain breakdown |
| `/results` | ResultsPage | Coaching exam comparative analysis + practice history |
| `/settings` | SettingsPage | Profile, cert level, preferences, Stripe portal |

### Auth
| Route | Page |
|-------|------|
| `/login` | Login (email + password) |
| `/signup` | Registration (name, email, cert level, password) |
| `/forgot-password` | Supabase password reset flow |

### Public Marketing
`/`, `/products`, `/products/:slug`, `/tutoring`, `/about`, `/contact`, `/educators`

### Admin
`/admin` — Internal tool for Vincent (student list, assign exams, view submissions)

---

## Design System

### Colors
- **Sidebar:** `#0D2137` navy, white text, active item = `#E03038` left border
- **Content background:** `#f8f9fa`
- **Cards:** `#ffffff`, shadow `0 1px 3px rgba(0,0,0,0.08)`, border-radius `8px`
- **Scores:** ≥90% `#28a745`, 80-89% `#17a2b8`, 70-79% `#ffc107`, <70% `#dc3545`
- **Buttons:** Primary = `#0D2137` fill. CTA = `#E03038` fill. Secondary = outline.

### Typography
- Inter or system sans-serif
- Body 16px, minimum 14px

### Mobile
- Bottom tab bar with same 5 icons (Home, Exams, Practice, Results, Settings)
- Sidebar hidden on mobile

---

## TEI Question Formats

The platform supports all 6 NREMT Technology Enhanced Item formats:
- **MC** — Multiple Choice (radio buttons)
- **MR** — Multiple Response (checkboxes)
- **BL** — Best List / Ordered Response (numbered list with ▲/▼ buttons, no drag-and-drop on mobile)
- **DD** — Drag and Drop / Fill-in (dropdown selects)
- **OB** — Option-Based (radio grid matrix)
- **Graphics** — Image-based questions

Scoring is **binary** (NREMT rules — no partial credit).

---

## Grading Pipeline (Don't Rebuild)

The exam grading pipeline is handled by N8N:
1. Student submits exam → frontend writes to `intake_submissions` or `posttest_submissions`
2. N8N webhook triggers → Claude API grades the exam
3. Results written back to Supabase (score_percentage, domain_breakdown)
4. Email sent to student

The frontend just needs to write to the submission tables. Don't rebuild the grading logic.

---

## What NOT to Build

- ❌ Gamification (streaks, badges, leaderboards, XP)
- ❌ Multiple study modes
- ❌ AI chatbot or insights cards
- ❌ Difficulty selector
- ❌ Progress rings shown to student
- ❌ Notifications system
- ❌ Onboarding wizard
- ❌ Social features
- ❌ Question of the day
- ❌ Calendar widgets
- ❌ Decorative illustrations
- ❌ Drag-and-drop on mobile (use buttons)
- ❌ Resources/downloads page (books are on Thinkific)
- ❌ Sub-navigation within sidebar items

---

## MCP Servers Available

When working in Claude Code, these MCP servers are connected:
- **GitHub** — Repo: `VBurburan/Path2MedicOgSite`
- **Vercel** — Team: `team_0P2EIsefiV9YdB7oQIBYxVk1`, Project: `prj_jlq4Ebhi4Bi0yQF0ClQYtijUnbQr`
- **Supabase** — Project: `kbfolxwbrjpajylkphwl`
- **Playwright** — Browser-based QA testing
- **N8N** — Workflow inspection (don't modify workflows)

---

## Development Workflow

1. All work happens on feature branches, merged to `main`
2. Vercel auto-deploys on push to `main`
3. After every push, verify deployment via Vercel MCP (`list_deployments`, `get_deployment_build_logs`)
4. Test with Playwright MCP after deployment
5. Check Supabase RLS with `get_advisors` after any migration

---

## Spec Reference

See `docs/PLATFORM_SPEC.md` for the complete Student Portal Spec v3.
