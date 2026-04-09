import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';

const getStartOfDay = (dateString: string | Date): Date => {
    const date = new Date(dateString);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};

// POST /api/diary/timer — update study timer
export async function POST(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    try {
        const { date, minutes } = await request.json();
        const targetDate = getStartOfDay(date);

        const snapshot = await prisma.dailySnapshot.upsert({
            where: { userId_date: { userId: user.id, date: targetDate } },
            update: { studyMinutes: { increment: minutes } },
            create: {
                userId: user.id,
                date: targetDate,
                studyMinutes: minutes,
                habitsCompleted: 0,
                problemsSolved: 0,
            },
        });

        return Response.json(snapshot);
    } catch (error: any) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
