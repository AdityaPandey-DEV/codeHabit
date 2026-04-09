import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

export const getAllHabits = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const habits = await prisma.habit.findMany({
        where: { userId: req.user.id },
        include: {
            logs: {
                orderBy: { date: 'desc' },
                take: 90, // Last ~3 months for calendar view
            },
        },
    });

    // Compute streaks for each habit
    const habitsWithStreaks = habits.map((habit: any) => {
        const completedDates = habit.logs
            .filter((log: any) => log.status === 'COMPLETED')
            .map((log: any) => {
                const d = new Date(log.date);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            })
            .sort()
            .reverse(); // Most recent first

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        // Current streak: count consecutive days from today backwards
        const today = new Date();
        const checkDate = new Date(today);
        
        for (let i = 0; i < 365; i++) {
            const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
            if (completedDates.includes(dateStr)) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                // Allow skipping today if it hasn't ended yet
                if (i === 0) {
                    checkDate.setDate(checkDate.getDate() - 1);
                    continue;
                }
                break;
            }
        }

        // Longest streak
        const sortedDates = [...completedDates].sort();
        for (let i = 0; i < sortedDates.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const prev = new Date(sortedDates[i - 1]);
                const curr = new Date(sortedDates[i]);
                const diffDays = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
                if (diffDays === 1) {
                    tempStreak++;
                } else {
                    tempStreak = 1;
                }
            }
            longestStreak = Math.max(longestStreak, tempStreak);
        }

        return {
            ...habit,
            currentStreak,
            longestStreak,
        };
    });

    res.status(200).json({
        status: 'success',
        results: habitsWithStreaks.length,
        data: {
            habits: habitsWithStreaks,
        },
    });
});

export const createHabit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, frequency, category } = req.body;

    if (!name) {
        return next(new AppError('Habit name is required', 400));
    }

    const newHabit = await prisma.habit.create({
        data: {
            userId: req.user.id,
            name,
            description,
            targetFrequency: frequency || 'DAILY',
            category: category || 'OTHER',
        },
    });

    res.status(201).json({
        status: 'success',
        data: {
            habit: newHabit,
        },
    });
});

export const updateHabit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { name, description, category, frequency } = req.body;

    // Verify ownership
    const habit = await prisma.habit.findFirst({
        where: { id, userId: req.user.id },
    });

    if (!habit) {
        return next(new AppError('Habit not found', 404));
    }

    const updatedHabit = await prisma.habit.update({
        where: { id },
        data: {
            ...(name && { name }),
            ...(description !== undefined && { description }),
            ...(category && { category }),
            ...(frequency && { targetFrequency: frequency }),
        },
    });

    res.status(200).json({
        status: 'success',
        data: {
            habit: updatedHabit,
        },
    });
});

export const deleteHabit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };

    // Verify ownership
    const habit = await prisma.habit.findFirst({
        where: { id, userId: req.user.id },
    });

    if (!habit) {
        return next(new AppError('Habit not found', 404));
    }

    // Cascade delete is handled by Prisma schema (onDelete: Cascade on HabitLog)
    await prisma.habit.delete({
        where: { id },
    });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

export const logHabit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { date, status, metadata } = req.body;

    if (!date || !status) {
        return next(new AppError('Date and Status are required', 400));
    }

    // Ensure date is a valid Date object (start of day)
    const logDate = new Date(date);

    const log = await prisma.habitLog.upsert({
        where: {
            habitId_date: {
                habitId: id,
                date: logDate,
            },
        },
        update: {
            status,
            metadata,
        },
        create: {
            habitId: id,
            date: logDate,
            status,
            metadata,
        },
    });

    res.status(200).json({
        status: 'success',
        data: {
            log,
        },
    });
});

export const getHabitLogs = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return next(new AppError('Please provide startDate and endDate', 400));
    }

    const logs = await prisma.habitLog.findMany({
        where: {
            habit: {
                userId: req.user.id
            },
            date: {
                gte: new Date(startDate as string),
                lte: new Date(endDate as string)
            }
        },
        include: {
            habit: true
        }
    });

    res.status(200).json({
        status: 'success',
        results: logs.length,
        data: {
            logs
        }
    });
});
