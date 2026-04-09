import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    const results = await prisma.quizResult.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
    });

    const subjectStats: Record<string, { totalAttempts: number; avgScore: number; bestScore: number }> = {};
    results.forEach((r: any) => {
        if (!subjectStats[r.subject]) {
            subjectStats[r.subject] = { totalAttempts: 0, avgScore: 0, bestScore: 0 };
        }
        subjectStats[r.subject].totalAttempts++;
        subjectStats[r.subject].avgScore += r.score;
        subjectStats[r.subject].bestScore = Math.max(subjectStats[r.subject].bestScore, r.score);
    });

    Object.keys(subjectStats).forEach((key) => {
        subjectStats[key].avgScore = Math.round(
            (subjectStats[key].avgScore / subjectStats[key].totalAttempts) * 10
        ) / 10;
    });

    return Response.json({ status: 'success', data: { results, subjectStats } });
}
