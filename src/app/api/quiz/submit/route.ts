import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { getAuthUser, jsonError } from '@/lib/auth';

export async function POST(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    try {
        const { subject, answers } = await request.json();

        if (!subject || !answers || !Array.isArray(answers)) {
            return jsonError('Subject and answers array are required', 400);
        }

        const questionIds = answers.map((a: any) => a.questionId);
        const questions = await prisma.question.findMany({
            where: { id: { in: questionIds } },
        });

        if (questions.length === 0) return jsonError('No valid questions found', 400);

        let score = 0;
        const total = questions.length;

        const results = answers.map((answer: any) => {
            const question = questions.find((q: any) => q.id === answer.questionId);
            if (question && question.correctAnswer === answer.selected) {
                score++;
                return { questionId: answer.questionId, correct: true };
            }
            return {
                questionId: answer.questionId,
                correct: false,
                correctAnswer: question?.correctAnswer,
            };
        });

        const quizResult = await prisma.quizResult.create({
            data: { userId: user.id, subject, score, total },
        });

        return Response.json({
            status: 'success',
            data: {
                resultId: quizResult.id,
                score,
                total,
                percentage: Math.round((score / total) * 100),
                results,
            },
        });
    } catch (error: any) {
        return Response.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
