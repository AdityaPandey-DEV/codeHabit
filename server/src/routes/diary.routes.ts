import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';

const router = Router();
const prisma = new PrismaClient();

// Get diary entry, tasks, and habit logs for a specific date
router.get('/:date', async (req: Request, res: Response): Promise<any> => {
    try {
        const { date } = req.params;
        const userId = req.query.userId as string;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const targetDate = new Date(date);

        const diaryEntry = await prisma.diaryEntry.findUnique({
            where: {
                userId_date: {
                    userId,
                    date: targetDate,
                },
            },
        });

        const tasks = await prisma.task.findMany({
            where: {
                userId,
                date: targetDate,
            },
        });

        // Also fetch habits for this date? The requirement says "track of his habit".
        // Might be useful to return habit logs here too, but frontend might fetch them separately.
        // Let's stick to Diary and Tasks for now.

        res.json({ diaryEntry, tasks });
    } catch (error) {
        console.error('Error fetching diary data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Upsert diary entry
router.post('/entry', async (req: Request, res: Response): Promise<any> => {
    try {
        const { date, content } = req.body;
        const userId = req.body.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const targetDate = new Date(date);

        const entry = await prisma.diaryEntry.upsert({
            where: {
                userId_date: {
                    userId,
                    date: targetDate,
                },
            },
            update: {
                content,
            },
            create: {
                userId,
                date: targetDate,
                content,
            },
        });

        res.json(entry);
    } catch (error) {
        console.error('Error saving diary entry:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Create task
router.post('/task', async (req: Request, res: Response): Promise<any> => {
    try {
        const { date, content } = req.body;
        const userId = req.body.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const task = await prisma.task.create({
            data: {
                userId,
                date: new Date(date),
                content,
            },
        });

        res.json(task);
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update task (toggle completion or content)
router.patch('/task/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { content, completed } = req.body;
        const userId = req.body.userId;

        // Verify ownership
        const existingTask = await prisma.task.findUnique({ where: { id } });
        if (!existingTask || existingTask.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const task = await prisma.task.update({
            where: { id },
            data: {
                content,
                completed,
            },
        });

        res.json(task);
    } catch (error) {
        console.error('Error updating task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete task
router.delete('/task/:id', async (req: Request, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const userId = req.body.userId;

        // Verify ownership
        const existingTask = await prisma.task.findUnique({ where: { id } });
        if (!existingTask || existingTask.userId !== userId) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        await prisma.task.delete({
            where: { id },
        });

        res.json({ message: 'Task deleted' });
    } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update study timer (DailySnapshot)
router.post('/timer', async (req: Request, res: Response): Promise<any> => {
    try {
        const { date, minutes } = req.body;
        const userId = req.body.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const targetDate = new Date(date);

        const snapshot = await prisma.dailySnapshot.upsert({
            where: {
                userId_date: {
                    userId,
                    date: targetDate,
                },
            },
            update: {
                studyMinutes: { increment: minutes },
            },
            create: {
                userId,
                date: targetDate,
                studyMinutes: minutes,
                habitsCompleted: 0,
                problemsSolved: 0,
            },
        });

        res.json(snapshot);
    } catch (error) {
        console.error('Error updating study time:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
