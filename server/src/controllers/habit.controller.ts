import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

export const getAllHabits = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const habits = await prisma.habit.findMany({
        where: { userId: req.user.id },
        include: {
            logs: {
                where: {
                    date: {
                        gte: new Date(new Date().setHours(0, 0, 0, 0)), // fetch logs for today onwards if needed, or simple default
                    },
                },
                take: 1, // Just to check if done today? Or maybe remove this include if we want clean list
            },
        },
    });

    res.status(200).json({
        status: 'success',
        results: habits.length,
        data: {
            habits,
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

export const logHabit = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as { id: string };
    const { date, status, metadata } = req.body;

    if (!date || !status) {
        return next(new AppError('Date and Status are required', 400));
    }

    // Ensure date is a valid Date object (or at least start of day)
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
    // Get logs for range
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
