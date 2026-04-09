import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';

// PATCH /api/diary/task/:id — update task
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    const { id } = await params;
    try {
        const existingTask = await prisma.task.findUnique({ where: { id } });
        if (!existingTask || existingTask.userId !== user.id) {
            return Response.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { content, completed } = await request.json();
        const task = await prisma.task.update({
            where: { id },
            data: { content, completed },
        });

        return Response.json(task);
    } catch (error: any) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/diary/task/:id — delete task
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    const { id } = await params;
    try {
        const existingTask = await prisma.task.findUnique({ where: { id } });
        if (!existingTask || existingTask.userId !== user.id) {
            return Response.json({ error: 'Forbidden' }, { status: 403 });
        }

        await prisma.task.delete({ where: { id } });
        return Response.json({ message: 'Task deleted' });
    } catch (error: any) {
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
