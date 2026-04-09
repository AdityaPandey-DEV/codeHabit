import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';

const getStartOfDay = (dateString: string | Date): Date => {
    const date = new Date(dateString);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};

// POST /api/diary/entry — upsert diary entry
export async function POST(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    try {
        const { date, content } = await request.json();
        const targetDate = getStartOfDay(date);

        const entry = await prisma.diaryEntry.upsert({
            where: { userId_date: { userId: user.id, date: targetDate } },
            update: { content },
            create: { userId: user.id, date: targetDate, content },
        });

        return Response.json(entry);
    } catch (error: any) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
