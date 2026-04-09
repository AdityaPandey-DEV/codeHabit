import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest, { params }: { params: Promise<{ subject: string }> }) {
    const { subject } = await params;

    const validSubjects = ['fullstack', 'dbms', 'os'];
    if (!validSubjects.includes(subject)) {
        return Response.json({ status: 'error', message: 'Invalid subject. Use: fullstack, dbms, os' }, { status: 400 });
    }

    const questions = await prisma.question.findMany({
        where: { subject },
        take: 10,
        select: {
            id: true,
            subject: true,
            question: true,
            option1: true,
            option2: true,
            option3: true,
            option4: true,
        },
    });

    return Response.json({ status: 'success', data: { questions } });
}
