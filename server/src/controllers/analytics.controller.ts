import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { catchAsync } from '../utils/catchAsync';
import { calculateCorrelation } from '../utils/math';

export const getDashboardAnalytics = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id;
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    // 1. Fetch Data
    const [habitLogs, submissions] = await Promise.all([
        prisma.habitLog.findMany({
            where: {
                habit: { userId },
                date: { gte: thirtyDaysAgo },
                status: 'COMPLETED'
            }
        }),
        prisma.leetCodeSubmission.findMany({
            where: {
                userId,
                submittedAt: { gte: thirtyDaysAgo },
                status: 'ACCEPTED' // Only count accepted for "Performance"
            }
        })
    ]);

    // 2. Aggregate by Date
    const dateMap = new Map<string, { habits: number, problems: number }>();

    // Initialize last 30 days with 0
    for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        dateMap.set(dateStr, { habits: 0, problems: 0 });
    }

    // Fill Habit Data
    habitLogs.forEach((log: { date: Date }) => {
        const dateStr = log.date.toISOString().split('T')[0];
        if (dateMap.has(dateStr)) {
            dateMap.get(dateStr)!.habits += 1;
        }
    });

    // Fill LeetCode Data
    submissions.forEach((sub: { submittedAt: Date }) => {
        const dateStr = sub.submittedAt.toISOString().split('T')[0];
        if (dateMap.has(dateStr)) {
            dateMap.get(dateStr)!.problems += 1;
        }
    });

    // 3. Prepare Arrays for Correlation
    const dates = Array.from(dateMap.keys()).sort();
    const habitCounts = dates.map(d => dateMap.get(d)!.habits);
    const problemCounts = dates.map(d => dateMap.get(d)!.problems);

    // 4. Calculate Correlation
    const correlation = calculateCorrelation(habitCounts, problemCounts);

    // 5. Generate Insight
    let insight = "Not enough data to find patterns yet.";
    if (habitCounts.reduce((a, b) => a + b, 0) > 5 && problemCounts.reduce((a, b) => a + b, 0) > 5) {
        if (correlation > 0.5) insight = "Strong positive link! Your coding improves when you stick to habits.";
        else if (correlation > 0.2) insight = "Slight positive trend. Consistency helps.";
        else if (correlation < -0.2) insight = "Negative correlation. Are your habits distracting you from coding?";
        else insight = "No clear link found yet. Keep tracking!";
    }

    res.status(200).json({
        status: 'success',
        data: {
            dates,
            habitCounts,
            problemCounts,
            correlation,
            insight,
            summary: {
                totalHabitsLast30Days: habitCounts.reduce((a, b) => a + b, 0),
                totalProblemsSolvedLast30Days: problemCounts.reduce((a, b) => a + b, 0)
            }
        }
    });
});
