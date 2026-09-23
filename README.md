# PrepForge AI

A placement preparation workspace for college students, built with Next.js, TypeScript, Prisma, and a responsive light theme. The current implementation includes secure email/password accounts, a persisted aptitude practice loop, original question seed data, coding problem browsing and submission storage, interview practice prompts, and a dashboard derived from a user's stored activity.

> This is an early, runnable foundation, not yet the complete feature set in the project brief. In particular, secure code execution, generated AI feedback/study plans, PostgreSQL production provisioning, admin content management, leaderboard/gamification, and full mock test sessions remain to be implemented.

## Features

- Email/password registration and login using bcrypt password hashing and signed, HTTP-only JWT cookies.
- Aptitude topic filtering, multiple-choice answers, explanations, and persistent attempts.
- Coding problem browsing across 30 original educational prompts and persistent code submission history. Submissions are saved as **Not executed**; no code is run on the web server.
- Technical and HR prompt libraries with saved written answers and private 1–5 confidence ratings. Students can review their own practice history and see average confidence reflected on their dashboard.
- Editable profile and preparation preferences: college, degree, branch, target role, current level, graduation year, and preferred language.
- Dashboard readiness uses saved aptitude accuracy, accepted coding results, and explicit student self-ratings for technical/HR confidence. Areas without activity are not assigned scores.
- Study starter suggestions and topic accuracy based on persisted aptitude attempts.
- Responsive light landing, authentication, and workspace views, including mobile bottom navigation.

## Screenshots

No screenshots are checked in yet. Run the app locally to preview the landing page and workspace.

## Architecture

```mermaid
flowchart TD
  Browser --> Next[Next.js App Router]
  Next --> API[Route handlers + validation]
  API --> Auth[Signed HTTP-only session]
  API --> Logic[Scoring and practice services]
  Logic --> Prisma[Prisma ORM]
  Prisma --> DB[(SQLite local / PostgreSQL deployment target)]
  Logic -. configured provider adapter pending .-> AI[LLM provider]
```

## Tech stack

- Next.js 16 App Router, React 19, TypeScript
- Tailwind CSS 4 (base tooling) plus a CSS-variable design system
- Prisma 6, SQLite for local development; PostgreSQL is the intended deployment database
- Zod validation, bcryptjs password hashing, jose session signing
- Recharts, React Hook Form, and lucide-react are installed for upcoming chart/form work

## Setup

Requirements: Node.js 20.9 or newer and npm.

```bash
npm install
cp .env.example .env
```

Set `AUTH_SECRET` to a random value of at least 32 characters. For example, generate one with `openssl rand -base64 32` and place it in `.env`. Never commit `.env`.

Local database:

```bash
npm run db:push
npm run db:seed
npm run dev
```

Open http://localhost:3000. Create an account at `/register`; the dashboard and practice routes require a session.

## Environment variables

| Name | Purpose |
|---|---|
| `DATABASE_URL` | Prisma database URL. The example uses local SQLite. |
| `AUTH_SECRET` | At least 32 characters; signs session cookies. |
| `AI_PROVIDER` | Reserved for provider selection. |
| `AI_API_KEY` | Server-only AI credential. No key is bundled in browser code. |
| `AI_MODEL` | Server-only model selection. |

## Main routes

- `/` landing page
- `/register`, `/login`
- `/dashboard`, `/aptitude`, `/coding`, `/technical`, `/hr`, `/coach`, `/progress`, `/profile` (authenticated)
- `POST /api/auth/register`, `/api/auth/login`, `/api/auth/logout`
- `GET /api/dashboard`, `/api/profile`, `/api/interview-practice`, `/api/aptitude/questions`, `/api/coding/problems`
- `PATCH /api/profile`, `POST /api/interview-practice`, `POST /api/aptitude/attempt`, `GET|POST /api/coding/submissions`
- `POST /api/ai/evaluate` returns a clear unavailable response until a provider adapter is implemented

## Database and seed content

`prisma/schema.prisma` defines users, aptitude questions and attempts, coding problems/submissions, and private interview-practice history. `prisma/seed.ts` inserts 105 aptitude practice records and 30 coding prompts. Seed content is original educational material; some generated aptitude entries are labeled practice variations and reuse a base concept. Do not present these variations as 105 fully distinct items.

The current schema is provider-configurable in principle, but moving from SQLite to PostgreSQL requires changing the Prisma datasource provider to `postgresql`, supplying a PostgreSQL `DATABASE_URL`, then creating/applying migrations. Production should use managed PostgreSQL with backups and a migration workflow.

## AI and safety boundaries

No answer evaluation, generated question, study plan, or AI recommendation is presented as real model output. The AI API route validates authenticated requests and returns a clear error until a real provider adapter is configured. AI feedback must be described as practice feedback rather than a hiring assessment. Code submissions are persisted only; never execute untrusted code in the application process. Integrate Judge0 or another isolated judge before enabling execution.

## Verification

Three unit tests cover readiness-score calculation. A local end-to-end check also exercised account registration, logout and case-insensitive sign-in, profile updates, aptitude/interview persistence, and student-specific dashboard metrics.


```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## Vercel deployment

This project is ready for Vercel deployment with a managed PostgreSQL database.

### Required environment variables

In the Vercel project dashboard, add these variables under Project Settings → Environment Variables:

- `DATABASE_URL` — production PostgreSQL connection string. Example: `postgresql://user:password@host:5432/prepforge?sslmode=require`
- `AUTH_SECRET` — a secure random secret of at least 32 characters.
- `AI_PROVIDER` — optional, left as `mock` until a real LLM adapter is added.
- `AI_API_KEY` — optional server-only key for the chosen provider.
- `AI_MODEL` — optional model name.

### Recommended Vercel settings

- Framework preset: Next.js
- Build command: `npm run vercel-build`
- Install command: `npm install`
- Output directory: `.next`
- Node.js version: 20.x

### Prisma on Vercel

The project includes a Vercel-safe build pipeline that runs Prisma generation and migrations before Next.js builds the app. For production, make sure your database is created and reachable before the first deployment.

### Deployment checklist

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add the environment variables listed above.
4. Ensure the production database is a PostgreSQL instance (Neon, Supabase, Railway, or similar).
5. Deploy the app and confirm the dashboard and auth flows work.

## Deployment notes

Deploy the Next.js application to Vercel or another Node.js host and use managed PostgreSQL. Configure `DATABASE_URL` and `AUTH_SECRET` in server environment settings. Run Prisma migrations during deployment. Add provider credentials only as server-side secrets when an AI adapter is ready. Review the project security checklist before production: rate limiting, CSRF/origin strategy, password recovery, session revocation, audit logging, database backups, and security headers need additional implementation.

## License

MIT; see `LICENSE`.
