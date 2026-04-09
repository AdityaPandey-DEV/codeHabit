import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';

// GET all habits
export async function GET(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    const habits = await prisma.habit.findMany({
        where: { userId: user.id },
        include: {
            logs: {
                orderBy: { date: 'desc' },
                take: 365,
            },
        },
        orderBy: { createdAt: 'desc' },
    });

    // Add streak computation
    const habitsWithStreaks = habits.map((habit: any) => {
        const completedDates = habit.logs
            .filter((l: any) => l.status === 'COMPLETED')
            .map((l: any) => {
                const d = new Date(l.date);
                return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            })
            .sort()
            .reverse();

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        const today = new Date();

        for (let i = 0; i < 365; i++) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
            if (completedDates.includes(dateStr)) {
                tempStreak++;
                if (i <= 1 || currentStreak > 0) currentStreak = tempStreak;
                longestStreak = Math.max(longestStreak, tempStreak);
            } else {
                if (i > 0) tempStreak = 0;
            }
        }

        return { ...habit, currentStreak, longestStreak };
    });

    return Response.json({ status: 'success', data: { habits: habitsWithStreaks } });
}

// POST create habit
export async function POST(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    try {
        const { name, description, category, targetFrequency } = await request.json();

        const habit = await prisma.habit.create({
            data: {
                name,
                description: description || '',
                category: category || 'OTHER',
                targetFrequency: targetFrequency || 'DAILY',
                userId: user.id,
            },
        });

        return Response.json({ status: 'success', data: { habit } }, { status: 201 });
    } catch (error: any) {
        return Response.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
