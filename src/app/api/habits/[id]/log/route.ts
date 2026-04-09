import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    const { id } = await params;
    try {
        const { date, status } = await request.json();

        const habit = await prisma.habit.findFirst({
            where: { id, userId: user.id },
        });
        if (!habit) return jsonError('Habit not found', 404);

        const logDate = new Date(date);

        // Upsert: if a log for that date exists, update it
        const existingLog = await prisma.habitLog.findFirst({
            where: {
                habitId: id,
                date: {
                    gte: new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate()),
                    lt: new Date(logDate.getFullYear(), logDate.getMonth(), logDate.getDate() + 1),
                },
            },
        });

        if (existingLog) {
            await prisma.habitLog.update({
                where: { id: existingLog.id },
                data: { status },
            });
        } else {
            await prisma.habitLog.create({
                data: { habitId: id, date: logDate, status },
            });
        }

        return Response.json({ status: 'success', message: 'Habit logged' });
    } catch (error: any) {
        return Response.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
