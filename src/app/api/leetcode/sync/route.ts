import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';
import { LeetCodeFetcher } from '@/lib/leetcode';

export async function POST(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    if (!user.leetcodeUsername) {
        return jsonError('No LeetCode username linked', 400);
    }

    try {
        const submissions = await LeetCodeFetcher.getRecentSubmissions(user.leetcodeUsername);

        let newCount = 0;
        for (const sub of submissions) {
            const existingSubmission = await prisma.leetCodeSubmission.findFirst({
                where: {
                    userId: user.id,
                    problemTitle: sub.title,
                    submittedAt: new Date(parseInt(sub.timestamp) * 1000),
                },
            });

            if (!existingSubmission) {
                await prisma.leetCodeSubmission.create({
                    data: {
                        userId: user.id,
                        problemTitle: sub.title,
                        problemSlug: sub.titleSlug || '',
                        difficulty: 'MEDIUM',
                        status: 'ACCEPTED',
                        language: 'Unknown',
                        submittedAt: new Date(parseInt(sub.timestamp) * 1000),
                    },
                });
                newCount++;
            }
        }

        return Response.json({ status: 'success', message: `Synced ${newCount} new submissions` });
    } catch (error: any) {
        return Response.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
