# PATH2MEDIC — STUDENT PORTAL SPEC v3 (FINAL)
## Replaces Phase 3 + Phase 4 of the Mega Prompt

---

## REFERENCE MODEL: LC-READY BY LIMMER EDUCATION

Before building anything, study how LC-Ready (lc-ready.com) works. Use the **Playwright MCP** to navigate the LC-Ready public pages and app store to understand their student-facing patterns. Here's what to observe and borrow:

**What LC-Ready does well:**
- Students log in and immediately see their purchased products (EMT PASS, EMT Review Plus, etc.)
- Each product has clear sections: Study Cards, Review Questions, Practice Exams
- Questions are organized by **domain** (Airway, Cardiology, Trauma, etc.) and **subdomain**
- After each exam, students see score + detailed rationales for every answer
- Score history is tracked so students can see progress
- Predictive Scoring tells students if they're on track to pass
- Cross-platform — phone and desktop stay synced
- The interface is utilitarian, not flashy. Content-first.

**What Path2Medic does DIFFERENTLY:**
- LC-Ready is primarily a self-study question bank. Path2Medic's primary product is **1-on-1 diagnostic coaching** with a pretest → coaching session → post-test pipeline. The question bank is secondary (subscription add-on).
- LC-Ready has separate products for test prep vs. classroom. Path2Medic combines both under one login — coaching students and subscribers use the same portal.
- Path2Medic's competitive edge is the **comparative analysis**: showing exactly how a student improved domain-by-domain between pretest and post-test. LC-Ready doesn't offer this because they don't do coaching.
- Path2Medic includes all 6 TEI formats (MC, MR, BL, DD, OB, Graphics). LC-Ready added TEIs recently but their core is still MC-heavy.

**The takeaway for building:** Make the student portal as clean and navigable as LC-Ready, but built around Path2Medic's two-track model: coaching exams + practice questions. Don't try to replicate LC-Ready's product catalog structure — Path2Medic is simpler.

---

## MCP TOOLS — USE ALL OF THESE

Claude Code has access to the following MCP servers. Use them proactively throughout the build.

### GitHub MCP
- **Repo:** `VBurburan/Path2MedicOgSite`
- Connected to Vercel for auto-deploy on push to `main`
- Use for all code commits, branch management, PRs

### Vercel MCP
- **Team:** `team_0P2EIsefiV9YdB7oQIBYxVk1`
- **Project:** `prj_jlq4Ebhi4Bi0yQF0ClQYtijUnbQr` (path2medic-og-site)
- **Framework:** Vite
- Use `list_deployments`, `get_deployment_build_logs` to verify every push
- Use `get_runtime_logs` to debug production issues
- Check deployment status after every push — don't move on until deployment is clean

### Supabase MCP
- **Project:** `kbfolxwbrjpajylkphwl`
- **URL:** `https://kbfolxwbrjpajylkphwl.supabase.co`
- Use `list_tables` to see all existing tables before creating new ones
- Use `execute_sql` for queries, `apply_migration` for DDL
- Use `get_publishable_keys` to get the anon key for frontend env vars
- Use `get_advisors` after migrations to check for security issues (especially missing RLS policies)
- **CRITICAL:** RLS is enabled on all tables. For anonymous inserts: `CREATE POLICY WITH CHECK (true)` AND `GRANT INSERT, SELECT TO anon`. Missing the GRANT causes 401 errors.

### Playwright MCP
- Use for **browser-based testing and QA** after each deployment
- Navigate the live Vercel URL, verify pages render, test auth flows, test exam submission
- Also use to study LC-Ready.com's student interface for design reference
- Test mobile viewport sizes (375px width) alongside desktop

### Figma MCP
- Use `get_design_context` and `get_screenshot` to extract visual specs from the existing Figma design if needed
- The current Figma Make export is broken — use Figma as a reference for layout and branding, not as source code

### N8N MCP
- **URL:** `https://vburburan.app.n8n.cloud/mcp-server/http`
- Existing workflows handle exam grading pipeline: student submits → N8N webhook → Claude API grades → writes results back to Supabase → emails student
- Don't rebuild these workflows. The frontend just needs to write to `intake_submissions` or `posttest_submissions` — N8N picks it up from there via webhook/trigger
- Use N8N MCP to inspect existing workflows if you need to understand the data flow

### Jotform MCP
- Existing intake forms for student onboarding
- Can be used for collecting student info during signup if needed
- Use `list_forms` to see what exists

### Gamma MCP
- For creating presentations or documentation if needed (lower priority)

### Dropbox MCP
- For file management if needed (lower priority)

---

## SUB-AGENT DEPLOYMENT STRATEGY

Deploy sub-agents to parallelize work. Here's the recommended split:

### Agent 1: Infrastructure & Deployment
**Job:** Get the repo clean, building, and deploying on Vercel.
- Audit the existing Figma Make codebase in `VBurburan/Path2MedicOgSite`
- Decision: fix the broken `figma:asset/` imports OR scaffold a clean Vite + React + Tailwind + React Router project
- Set up environment variables on Vercel (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
- Establish `vercel.json` with SPA rewrites
- Get a clean green deployment before anyone else writes feature code
- Set up project structure: `/src/components`, `/src/pages`, `/src/lib/supabase.ts`, `/src/hooks`, `/src/layouts`
- **Uses:** GitHub MCP, Vercel MCP, Supabase MCP (for anon key)

### Agent 2: Auth & Database
**Job:** Wire up Supabase Auth and create any missing tables.
- Implement email/password login, signup, forgot-password using `@supabase/supabase-js`
- On signup, create `students` row linked to `auth.users.id`
- Create `exam_assignments` table (schema in this spec)
- Verify RLS policies on all student-facing tables
- Create React auth context/provider and route protection (redirect to `/login` if unauthenticated)
- **Uses:** Supabase MCP, GitHub MCP

### Agent 3: UI & Pages
**Job:** Build all screens from this spec.
- Marketing pages (Home, Products, Tutoring, About) — public routes
- Student portal (Dashboard Home, Exams, Practice, Results, Settings) — protected routes
- Sidebar layout component with mobile bottom tab bar
- All visual styling per the design system in this spec
- **Uses:** GitHub MCP, Figma MCP (for design reference), Playwright MCP (for QA)

### Agent 4: Exam Engine & Data
**Job:** Build the practice question engine and exam display.
- Practice session: configure → take questions (all TEI formats) → submit → results
- Exam iframe/embed for coaching exams (using existing HTML exam files)
- Results view with domain comparison charts
- Write session data to `exam_sessions`, `student_question_history`
- Comparative analysis view (pretest vs post-test)
- **Uses:** Supabase MCP, GitHub MCP, Playwright MCP (for testing TEI rendering)

**Coordination:** Agent 1 must complete first (clean deployment). Agents 2-4 work in feature branches and merge sequentially. Agent 3 and Agent 4 can work in parallel if they're on different routes.

---

## DESIGN PHILOSOPHY

The interface should be as clean and navigable as LC-Ready but built for Path2Medic's model. Every screen has one purpose. Five sidebar items, that's it.

Two types of students:
1. **Coaching students** — Pretest → Vincent reviews → Zoom coaching → Post-test → Comparative results. This is the PRIMARY user today.
2. **Subscribers** — $19/mo or $39/mo for practice question bank access. This is the GROWTH revenue stream.

Many students are both.

---

## LAYOUT

```
┌──────────────────────────────────────────────────┐
│  [Logo]  Path2Medic          [Name ▾]  [Logout]  │
├──────────┬───────────────────────────────────────┤
│          │                                       │
│  Home    │       CONTENT AREA                    │
│  Exams   │                                       │
│ Practice │   (one purpose per screen)            │
│ Results  │                                       │
│ Settings │                                       │
│          │                                       │
├──────────┴───────────────────────────────────────┤
```

**Sidebar:** Navy `#0D2137`, white text, active item = left border accent `#E03038`. Icons from Lucide React.
**Mobile:** Bottom tab bar with same 5 icons.
**Content:** Light gray background `#f8f9fa`, white cards with subtle shadow.

---

## HOME (`/dashboard`)

One contextual message based on what needs attention. Not multiple cards.

- Has an exam to take → "You have an exam ready." + [Start Exam →]
- Exam submitted, awaiting review → "Your exam is being reviewed."
- Post-test graded → "Your post-test results are ready!" + [View Results →]
- Nothing pending (subscriber) → "Ready to practice?" + [Start Practice →]
- Nothing pending (non-subscriber) → "Want to keep practicing?" + [View Plans →]

Below: one line showing Certification, Membership tier, and Last Score.

---

## EXAMS (`/exams`)

List of coaching exams assigned by Vincent. Each shows name, question count, status badge, and one action button.

| Status | Badge | Button |
|--------|-------|--------|
| Available | Blue | Start Exam |
| In Progress | Amber | Resume |
| Submitted | Gray | *(none — "Awaiting Review")* |
| Graded | Green/Red | View Results |

**Exam delivery:** Use existing HTML exam files via iframe or full-screen embed. They already have JavaScript that writes to `intake_submissions` / `posttest_submissions` in Supabase. N8N webhooks handle grading automatically. Don't rebuild the exam engine — just host the files.

**Database:** Create `exam_assignments` table:
```sql
CREATE TABLE exam_assignments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  student_email TEXT NOT NULL,
  exam_type TEXT CHECK (exam_type IN ('intake', 'posttest')) NOT NULL,
  certification_level certification_level NOT NULL,
  exam_title TEXT NOT NULL,
  question_count INTEGER,
  exam_file_url TEXT,
  exam_id TEXT,
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'in_progress', 'submitted', 'graded')),
  assigned_at TIMESTAMPTZ DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  submitted_at TIMESTAMPTZ,
  graded_at TIMESTAMPTZ,
  score_pct NUMERIC,
  linked_intake_id UUID,
  submission_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## PRACTICE (`/practice`)

Gated behind subscription. Non-subscribers see pricing and [Subscribe →] CTA.

**Subscribers see:**

Top: One row of configuration.
```
Questions: [10 ▾]    Focus: [All Domains ▾]    [Start Practice →]
```
Questions: 10, 25, 50. Focus: All Domains, Weak Areas, or a specific domain from the `domains` table for their cert level.

Bottom: List of recent practice sessions with score and [Review] link.

**Question delivery:**
- One question per screen
- Top: "Question 3 of 25" + [Flag] button
- TEI rendering: MC=radios, MR=checkboxes, BL=numbered list with ▲/▼ buttons, DD=dropdowns, OB=radio grid
- Binary scoring (NREMT rules — no partial credit)

**Results after submit:**
- Score
- Domain breakdown table
- Missed questions expanded with rationale, correct questions collapsed

**Data:** Write to `exam_sessions` + `student_question_history`. Mastery tracking is silent (3 consecutive correct → deprioritize in future sessions, student never sees this).

---

## RESULTS (`/results`)

Two sections: Coaching Exams and Practice Sessions.

**Coaching exam results — comparative analysis (the key differentiator):**
- If pretest AND post-test exist: side-by-side scores, domain-by-domain comparison table, change column color-coded (green=improvement, red=regression)
- Simple grouped horizontal bar chart (Recharts) showing pre vs post by domain
- If only one exam: just show that exam's breakdown

**Practice session results:** Score, domain breakdown, question review with rationales.

**Data source:** `intake_submissions.domain_breakdown`, `posttest_submissions.domain_breakdown`, `exam_sessions`

---

## SETTINGS (`/settings`)

Simple form: Name, Email (read-only), Certification Level dropdown, Target Exam Date, Rationale display preference toggle, Membership info with Stripe portal link. [Save Changes] button.

---

## AUTH

- `/login` — centered card, logo, email+password, login button
- `/signup` — name, email, password, certification level → creates `students` row
- `/forgot-password` — Supabase auth reset flow
- All portal routes protected, redirect to `/login` if unauthenticated

---

## ADMIN (`/admin`) — Scaffold Only

Minimal internal tool for Vincent:
- Admin login (check against admin email list)
- Student list table
- Assign exam button (creates `exam_assignments` row)
- View submissions list with status
- Can be ugly — it's internal tooling

---

## QA CHECKLIST — Use Playwright MCP to Verify

After each deployment, run through these with Playwright:

1. **Public pages load** — Homepage, Products, Tutoring render without errors
2. **Auth flow works** — Can sign up, log in, log out, access protected routes
3. **Dashboard shows contextual message** — Correct state for the logged-in user
4. **Exams page lists assignments** — Status badges display correctly
5. **Practice session runs** — Can configure, answer questions, submit, see results
6. **Results page shows data** — Domain breakdown renders, comparison works if both exams exist
7. **Mobile responsive** — Test at 375px width, bottom tab bar appears, sidebar hidden
8. **Supabase writes succeed** — Check tables after submission to verify data landed

---

## WHAT NOT TO BUILD

- ❌ Gamification (streaks, badges, leaderboards, XP)
- ❌ Multiple study modes
- ❌ AI chatbot or insights cards
- ❌ Difficulty selector
- ❌ Progress rings shown to student
- ❌ Notifications
- ❌ Onboarding wizard
- ❌ Social features
- ❌ Question of the day
- ❌ Calendar widgets
- ❌ Decorative illustrations
- ❌ Drag-and-drop on mobile (use buttons)
- ❌ Resources/downloads page (books are on Thinkific)
- ❌ Sub-navigation within sidebar items

---

## VISUAL STYLE

- Sidebar: `#0D2137` navy, white text, active = `#E03038` left border
- Content bg: `#f8f9fa`
- Cards: `#ffffff`, shadow `0 1px 3px rgba(0,0,0,0.08)`, border-radius `8px`
- Scores: ≥90% `#28a745`, 80-89% `#17a2b8`, 70-79% `#ffc107`, <70% `#dc3545`
- Typography: Inter or system sans-serif, body 16px, minimum 14px
- Buttons: Primary = `#0D2137` fill. CTA = `#E03038` fill. Secondary = outline.
- Mobile: bottom tab bar, same 5 icons

Professional medical education tool. Not playful. Not startup-y.
