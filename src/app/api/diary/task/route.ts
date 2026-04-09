import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';

const getStartOfDay = (dateString: string | Date): Date => {
    const date = new Date(dateString);
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
};

// POST /api/diary/task — create task
export async function POST(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    try {
        const { date, content } = await request.json();
        const task = await prisma.task.create({
            data: { userId: user.id, date: getStartOfDay(date), content },
        });

        return Response.json(task);
    } catch (error: any) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
