import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

import errorHandler from './middleware/errorHandler';
import authRoutes from './routes/auth.routes';
import habitRoutes from './routes/habit.routes';
import leetcodeRoutes from './routes/leetcode.routes';
import analyticsRoutes from './routes/analytics.routes';

const app: Express = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/leetcode', leetcodeRoutes);
app.use('/api/analytics', analyticsRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Habit & LeetCode Analytics API is running');
});

app.use(errorHandler);

app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
