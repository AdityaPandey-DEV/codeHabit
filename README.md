# CodeHabit

CodeHabit is a personal workspace for developers to record habits, focused study sessions, diary notes, quizzes, and LeetCode activity.

![CodeHabit Dashboard](https://code-habit.vercel.app/opengraph-image.png)

## Live site

Set `NEXT_PUBLIC_SITE_URL` to the HTTPS address of your own domain, for example `https://app.yourdomain.com`. This value is used for site metadata and sharing previews.

## Features

| Module | Description |
|--------|-------------|
| **Dashboard** | View saved habits and coding activity together |
| **Habit Tracker** | Add / edit / delete habits, daily check-offs, streak tracking, 90-day calendar view |
| **LeetCode Analytics** | Profile stats (Easy/Med/Hard), yearly 365-day submission heatmap, current streak |
| **Quiz Assessment** | 10-question MCQs in Full Stack Dev, DBMS, and OS with timer and score tracking |
| **Analytics** | 30-day habit and coding correlation based on your saved records |
| **Diary** | Daily journal entries, task management, and study timer |

## Tech Stack

- **Frontend**: Next.js 16 (React 19), Tailwind CSS v4, shadcn/ui, Recharts
- **Backend**: Next.js API Routes (serverless)
- **Database**: Vercel Postgres (PostgreSQL) via Prisma ORM
- **Auth**: JWT (bcryptjs + jsonwebtoken)
- **Deployment**: Vercel (single project)

## Project Structure

```
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Quiz question seeder (30 MCQs)
├── src/
│   ├── app/
│   │   ├── api/            # Backend API routes (serverless)
│   │   │   ├── auth/       # register, login, me
│   │   │   ├── habits/     # CRUD + daily logging
│   │   │   ├── leetcode/   # sync, stats, profile/[username]
│   │   │   ├── quiz/       # questions, submit, results
│   │   │   ├── analytics/  # dashboard correlation
│   │   │   └── diary/      # entries, tasks, timer
│   │   ├── auth/           # Login / Register page
│   │   ├── habits/         # Habit tracker page
│   │   ├── leetcode/       # LeetCode analytics page
│   │   ├── quiz/           # Quiz + results pages
│   │   ├── analytics/      # Analytics page
│   │   ├── diary/          # Diary page
│   │   └── page.tsx        # Dashboard
│   ├── components/
│   │   ├── Heatmap.tsx     # GitHub-style SVG heatmap
│   │   ├── Sidebar.tsx     # Navigation sidebar
│   │   └── ui/             # shadcn/ui components
│   └── lib/
│       ├── api.ts          # Axios client
│       ├── auth.ts         # JWT utilities
│       ├── prisma.ts       # Prisma singleton
│       ├── leetcode.ts     # LeetCode GraphQL fetcher
│       └── math.ts         # Correlation calculation
```

## Setup

### Prerequisites
- Node.js 18+
- Vercel account with Postgres storage

### Local Development

```bash
npm install

# Create .env.local with:
# POSTGRES_PRISMA_URL=your_postgres_url
# POSTGRES_URL_NON_POOLING=your_direct_url
# JWT_SECRET=your_secret

npx prisma db push    # Create tables
npx prisma db seed    # Seed 30 quiz questions
npm run dev           # Start at localhost:3000
```

### Deploy to Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add Vercel Postgres from Storage tab
4. Add `JWT_SECRET` environment variable
5. Add your custom domain in Vercel and set `NEXT_PUBLIC_SITE_URL` to its full HTTPS address.
6. Deploy. Prisma generates automatically via `postinstall`.

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | ✗ | Register user |
| POST | `/api/auth/login` | ✗ | Login |
| GET | `/api/auth/me` | ✓ | Current user |
| GET | `/api/habits` | ✓ | List habits with streaks |
| POST | `/api/habits` | ✓ | Create habit |
| PUT | `/api/habits/:id` | ✓ | Update habit |
| DELETE | `/api/habits/:id` | ✓ | Delete habit |
| POST | `/api/habits/:id/log` | ✓ | Log daily completion |
| GET | `/api/leetcode/stats` | ✓ | Synced submission stats |
| POST | `/api/leetcode/sync` | ✓ | Sync from LeetCode |
| GET | `/api/leetcode/profile/:user` | ✓ | Profile + yearly heatmap |
| GET | `/api/quiz/questions/:subject` | ✓ | Get 10 MCQs |
| POST | `/api/quiz/submit` | ✓ | Submit and score quiz |
| GET | `/api/quiz/results` | ✓ | Past results and stats |
| GET | `/api/analytics/dashboard` | ✓ | 30-day correlation data |

## 📄 License

MIT
