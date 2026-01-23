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

        // Check if already exists to avoid duplicates
        // Using a composite check or just checking if we have a submission for this user, slug, and timestamp
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

    // Simple analysis
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
