import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';

const getStartOfDay = (dateString: string | Date): Date => {
    const date = new Date(dateString);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};

// GET /api/diary/:date
export async function GET(request: NextRequest, { params }: { params: Promise<{ date: string }> }) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    const { date } = await params;
    const targetDate = getStartOfDay(date);

    try {
        const diaryEntry = await prisma.diaryEntry.findUnique({
            where: { userId_date: { userId: user.id, date: targetDate } },
        });

        const tasks = await prisma.task.findMany({
            where: { userId: user.id, date: targetDate },
            orderBy: { createdAt: 'asc' },
        });

        return Response.json({ diaryEntry, tasks });
    } catch (error: any) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
