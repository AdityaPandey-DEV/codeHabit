# CodeHabit Analytics

**CodeHabit Analytics** is an advanced full-stack platform that helps developers correlate their daily daily habits with their LeetCode coding performance.

## 🚀 Features

*   **Unified Dashboard**: Visualize your coding trends alongside your habit consistency.
*   **Correlation Engine**: Automatically calculates the Pearson correlation coefficient between your lifestyle and your coding output.
*   **Deep Integration**: Fetches LeetCode submission data directly via a custom graphQL scraper.
*   **Premium UI**: Built with Next.js 14, Tailwind CSS, and Shadcn/UI (Dark Mode).

## 🛠 Tech Stack

*   **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Recharts.
*   **Backend**: Node.js, Express, TypeScript, Prisma ORM.
*   **Database**: PostgreSQL.
*   **Analytics**: Custom Pearson Correlation Algorithm.

## 📦 Project Structure

*   `client/`: Frontend application.
*   `server/`: Backend REST API.

## 🏁 Getting Started

### Prerequisites
*   Node.js 18+
*   PostgreSQL Database

### Setup

1.  **Backend**
    ```bash
    cd server
    npm install
    npx prisma generate
    npx prisma db push
    npm run dev
    ```

2.  **Frontend**
    ```bash
    cd client
    npm install
    npm run dev
    ```

3.  Visit `http://localhost:3000`.

## 📄 License
MIT
