import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';

// PUT update habit
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    const { id } = await params;
    try {
        const body = await request.json();
        const habit = await prisma.habit.updateMany({
            where: { id, userId: user.id },
            data: {
                ...(body.name && { name: body.name }),
                ...(body.category && { category: body.category }),
                ...(body.description !== undefined && { description: body.description }),
            },
        });

        if (habit.count === 0) return jsonError('Habit not found', 404);
        return Response.json({ status: 'success', message: 'Habit updated' });
    } catch (error: any) {
        return Response.json({ status: 'error', message: error.message }, { status: 500 });
    }
}

// DELETE habit
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    const { id } = await params;
    try {
        const habit = await prisma.habit.deleteMany({
            where: { id, userId: user.id },
        });

        if (habit.count === 0) return jsonError('Habit not found', 404);
        return Response.json({ status: 'success', message: 'Habit deleted' });
    } catch (error: any) {
        return Response.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
