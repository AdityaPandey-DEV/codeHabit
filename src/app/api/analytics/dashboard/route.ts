import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';
import { calculateCorrelation } from '@/lib/math';

export async function GET(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const [habitLogs, submissions] = await Promise.all([
        prisma.habitLog.findMany({
            where: {
                habit: { userId: user.id },
                date: { gte: thirtyDaysAgo },
                status: 'COMPLETED',
            },
        }),
        prisma.leetCodeSubmission.findMany({
            where: {
                userId: user.id,
                submittedAt: { gte: thirtyDaysAgo },
                status: 'ACCEPTED',
            },
        }),
    ]);

    const dateMap = new Map<string, { habits: number; problems: number }>();
    for (let d = new Date(thirtyDaysAgo); d <= today; d.setDate(d.getDate() + 1)) {
        const dateStr = d.toISOString().split('T')[0];
        dateMap.set(dateStr, { habits: 0, problems: 0 });
    }

    habitLogs.forEach((log: any) => {
        const dateStr = log.date.toISOString().split('T')[0];
        if (dateMap.has(dateStr)) dateMap.get(dateStr)!.habits += 1;
    });

    submissions.forEach((sub: any) => {
        const dateStr = sub.submittedAt.toISOString().split('T')[0];
        if (dateMap.has(dateStr)) dateMap.get(dateStr)!.problems += 1;
    });

    const dates = Array.from(dateMap.keys()).sort();
    const habitCounts = dates.map((d) => dateMap.get(d)!.habits);
    const problemCounts = dates.map((d) => dateMap.get(d)!.problems);
    const correlation = calculateCorrelation(habitCounts, problemCounts);

    let insight = 'Not enough data to find patterns yet.';
    if (habitCounts.reduce((a, b) => a + b, 0) > 5 && problemCounts.reduce((a, b) => a + b, 0) > 5) {
        if (correlation > 0.5) insight = 'Strong positive link! Your coding improves when you stick to habits.';
        else if (correlation > 0.2) insight = 'Slight positive trend. Consistency helps.';
        else if (correlation < -0.2) insight = 'Negative correlation. Are your habits distracting you from coding?';
        else insight = 'No clear link found yet. Keep tracking!';
    }

    return Response.json({
        status: 'success',
        data: {
            dates,
            habitCounts,
            problemCounts,
            correlation,
            insight,
            summary: {
                totalHabitsLast30Days: habitCounts.reduce((a, b) => a + b, 0),
                totalProblemsSolvedLast30Days: problemCounts.reduce((a, b) => a + b, 0),
            },
        },
    });
}
