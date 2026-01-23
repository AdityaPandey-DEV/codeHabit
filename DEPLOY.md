# Deployment Guide

This guide explains how to deploy the **CodeHabit Analytics** platform to the web.

## Architecture Overview
*   **Frontend**: Next.js (Deploy on **Vercel**)
*   **Backend**: Express API (Deploy on **Render**)
*   **Database**: PostgreSQL (Hosted on **Railway**, **Supabase**, or **Render**)

---

## Part 1: Database (PostgreSQL)

You need a hosted PostgreSQL database. We recommend **Railway** or **Supabase** for their generous free tiers.

**Option A: Railway (Recommended)**
1.  Login to [Railway.app](https://railway.app/).
2.  Create a **New Project** -> **Provision PostgreSQL**.
3.  Click on the PostgreSQL service -> **Variables**.
4.  Copy the `DATABASE_URL`.

**Option B: Render**
1.  Login to [Render.com](https://render.com/).
2.  Click **New +** -> **PostgreSQL**.
3.  Copy the `Internal Database URL` (for Render backend) or `External Database URL`.

---

## Part 2: Backend (Render)

1.  **Login to [Render.com](https://render.com/)**.
2.  Click **New +** -> **Web Service**.
3.  **Connect GitHub**:
    *   Select your `code-habit-analytics` repo.
4.  **Configure Service**:
    *   **Name**: `code-habit-server`
    *   **Root Directory**: `server`
    *   **Environment**: `Node`
    *   **Build Command**: `npm install && npx prisma generate`
    *   **Start Command**: `npm start` (or `npx ts-node src/index.ts` if no build step)
        *   *Better*: Add `"start": "ts-node src/index.ts"` to your `server/package.json` if not present.
5.  **Environment Variables**:
    *   Add the following variables:
        *   `PORT`: `8000`
        *   `DATABASE_URL`: *Paste your connection string from Part 1.*
        *   `JWT_SECRET`: *Any secure random string.*
6.  Click **Create Web Service**.
7.  **Copy the Backend URL**: Once live, copy the URL (e.g., `https://code-habit-server.onrender.com`).

---

## Part 3: Frontend (Vercel)

1.  **Login to [Vercel.com](https://vercel.com/)**.
2.  **Add New Project** -> **Import GitHub Repository**.
3.  Select `code-habit-analytics`.
4.  **Configure Project**:
    *   **Root Directory**: Click "Edit" and select `client`.
    *   **Framework Preset**: Next.js.
5.  **Environment Variables**:
    *   `NEXT_PUBLIC_API_URL`: Paste your **Render Backend URL** (e.g., `https://code-habit-server.onrender.com/api`).
    *   *Note*: Ensure you add `/api` at the end if your backend routes are prefixed with it (which they are).
6.  **Deploy**: Click "Deploy".

---

## Part 4: Final Verification

1.  Open your Vercel URL.
2.  Test the **Register** flow. If it works, your Frontend is successfully talking to your Render Backend, which is writing to your Database.
