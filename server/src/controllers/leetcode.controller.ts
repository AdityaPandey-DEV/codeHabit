import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';
import { LeetCodeFetcher } from '../services/LeetCodeFetcher';

export const syncLeetCode = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });

    if (!user || !user.leetcodeUsername) {
        return next(new AppError('User not found or LeetCode username not set', 400));
    }

    // 1. Fetch recent submissions
    const recentSubmissions = await LeetCodeFetcher.getRecentSubmissions(user.leetcodeUsername);

    // 2. Process and store them
    let newCount = 0;
    // @ts-ignore
    for (const sub of recentSubmissions) {
        const submittedAt = new Date(parseInt(sub.timestamp) * 1000);

        const exists = await prisma.leetCodeSubmission.findFirst({
            where: {
                userId: user.id,
                problemSlug: sub.titleSlug,
                submittedAt: submittedAt,
            }
        });

        if (!exists) {
            await prisma.leetCodeSubmission.create({
                data: {
                    userId: user.id,
                    problemTitle: sub.title,
                    problemSlug: sub.titleSlug,
                    difficulty: 'MEDIUM', // Defaulting for now as recentSubmissionList doesn't provide it
                    status: LeetCodeFetcher.mapStatus(sub.statusDisplay),
                    submittedAt: submittedAt,
                    language: sub.lang,
                }
            });
            newCount++;
        }
    }

    res.status(200).json({
        status: 'success',
        message: `Synced successfully. ${newCount} new submissions added.`,
        data: {
            newSubmissions: newCount
        }
    });
});

export const getLeetCodeStats = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const submissions = await prisma.leetCodeSubmission.findMany({
        where: { userId: req.user.id },
        orderBy: { submittedAt: 'desc' },
        take: 100
    });

    // @ts-ignore
    const totalSolved = submissions.filter(s => s.status === 'ACCEPTED').length;

    res.status(200).json({
        status: 'success',
        data: {
            totalSolved,
            recent: submissions
        }
    });
});

/**
 * Fetch LeetCode profile stats and yearly submission calendar
 * Uses the LeetCode GraphQL API directly (no DB storage needed)
 */
export const getLeetCodeProfile = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username } = req.params;

    if (!username) {
        return next(new AppError('Username is required', 400));
    }

    try {
        // Fetch profile and calendar in parallel
        const [profile, calendar] = await Promise.all([
            LeetCodeFetcher.getUserProfile(username),
            LeetCodeFetcher.getSubmissionCalendar(username),
        ]);

        // Transform calendar to array format for frontend
        // calendar is { "timestamp": count }
        const calendarArray = Object.entries(calendar).map(([timestamp, count]) => ({
            date: new Date(parseInt(timestamp) * 1000).toISOString().split('T')[0],
            count: count as number,
        }));

        // Calculate current streak from calendar
        let currentStreak = 0;
        const today = new Date();
        const checkDate = new Date(today);
        
        for (let i = 0; i < 365; i++) {
            const dateStr = checkDate.toISOString().split('T')[0];
            const found = calendarArray.find(c => c.date === dateStr);
            if (found && found.count > 0) {
                currentStreak++;
                checkDate.setDate(checkDate.getDate() - 1);
            } else {
                if (i === 0) {
                    // Today might not have submissions yet
                    checkDate.setDate(checkDate.getDate() - 1);
                    continue;
                }
                break;
            }
        }

        res.status(200).json({
            status: 'success',
            data: {
                profile,
                calendar: calendarArray,
                currentStreak,
            }
        });
    } catch (error: any) {
        return next(new AppError(error.message || 'Failed to fetch LeetCode data', 500));
    }
});
