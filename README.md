# CodeHabit Analytics

**Full-stack developer productivity platform — habit tracking, LeetCode integration, correlation engine, and analytics dashboard.**

![Next.js](https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)

---

## What It Does

CodeHabit unifies habit logging, LeetCode performance analytics, coding quizzes, and a developer diary — with a **correlation engine** that statistically analyzes how daily habits impact coding output.

**Key Features:**
- **Habit tracker** with GitHub-style SVG heatmap
- **LeetCode sync** via GraphQL API — live stats, submissions, progress
- **Correlation engine** — habits vs. coding performance analysis
- **Quiz system** — 30 MCQs with scoring history
- **Developer diary** — daily entries with task tracking and timer

## Architecture

```
Next.js App Router (Server Components)
├── /api/habits      → Habit CRUD + daily logging
├── /api/leetcode    → GraphQL sync + stats
├── /api/analytics   → Correlation engine
├── /api/quiz        → Questions + scoring
├── /api/diary       → Entries + tasks
└── Prisma ORM → PostgreSQL (Vercel)
                     + LeetCode GraphQL API (external)
```

## Tech Stack

| Component | Technology |
|---|---|
| Framework | Next.js 15 (App Router, Server Components) |
| Language | TypeScript |
| Database | PostgreSQL (Vercel Postgres) + Prisma |
| Auth | JWT |
| UI | Tailwind CSS + shadcn/ui |

## My Role

I designed the data model, planned the correlation algorithm, integrated the LeetCode GraphQL API, and scoped the analytics dashboard. Code generation was accelerated using AI tools; architecture, API design, and integration are mine.

## Quick Start

```bash
git clone https://github.com/AdityaPandey-DEV/codeHabit.git && cd codeHabit
npm install
# Configure .env.local with PostgreSQL + JWT_SECRET
npx prisma db push && npm run dev
```

---

<div align="center">

*Architected & built by [Aditya Pandey](https://github.com/AdityaPandey-DEV) — AI-augmented development*

</div>
