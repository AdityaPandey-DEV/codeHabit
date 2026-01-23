# Deployment Guide

This guide explains how to deploy the **CodeHabit Analytics** platform to the web.

## Architecture Overview
*   **Frontend**: Next.js (Deploy on **Vercel**)
*   **Backend**: Express API (Deploy on **Railway** or **Render**)
*   **Database**: PostgreSQL (Hosted on **Railway**, **Supabase**, or **Neon**)

---

## Part 1: Database & Backend (Railway)

We recommend **Railway** because it handles both Node.js apps and PostgreSQL databases easily.

1.  **Sign Up/Login** to [Railway.app](https://railway.app/).
2.  **Create a New Project** -> **Provision PostgreSQL**.
3.  **Deploy Backend Code**:
    *   In the same project, click **New** -> **GitHub Repo**.
    *   Select your `code-habit-analytics` repo.
    *   **Important**: Configure the **Root Directory** to `server`.
    *   Go to **Variables**:
        *   `PORT`: `8000`
        *   `DATABASE_URL`: *Copy this from the PostgreSQL service you just created in step 2.*
        *   `JWT_SECRET`: *Generate a secure random string.*
    *   Railway will automatically detect `package.json`, install dependencies, and start the server.
4.  **Get Backend URL**:
    *   Once deployed, go to **Settings** -> **Networking** -> **Generate Domain**.
    *   Copy the URL (e.g., `https://server-production.up.railway.app`).

---

## Part 2: Frontend (Vercel)

1.  **Sign Up/Login** to [Vercel.com](https://vercel.com/).
2.  **Add New Project** -> **Import GitHub Repository**.
3.  Select `code-habit-analytics`.
4.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `client`.
    *   **Framework Preset**: Next.js (Should be auto-detected).
5.  **Environment Variables**:
    *   Wait! We need to update the frontend code to use the production backend URL instead of localhost.

### Updating Frontend for Production
In your local code, update `client/src/lib/api.ts` to use an environment variable:

```typescript
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
});
```

Then in Vercel Variables:
*   `NEXT_PUBLIC_API_URL`: Paste your Railway Backend URL (e.g., `https://server-production.up.railway.app/api`).

6.  **Deploy**: Click "Deploy".

---

## Part 3: Final Check

1.  Open your Vercel URL (e.g., `https://code-habit-analytics.vercel.app`).
2.  Open the Network Tab (F12) to ensure requests are hitting your Railway backend, not localhost.
3.  Test Registration and Login.
