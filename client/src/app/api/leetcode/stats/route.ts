import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    const submissions = await prisma.leetCodeSubmission.findMany({
        where: { userId: user.id },
        orderBy: { submittedAt: 'desc' },
    });

    const totalSolved = await prisma.leetCodeSubmission.count({
        where: { userId: user.id, status: 'ACCEPTED' },
    });

    return Response.json({
        status: 'success',
        data: {
            recent: submissions,
            totalSolved,
        },
    });
}
