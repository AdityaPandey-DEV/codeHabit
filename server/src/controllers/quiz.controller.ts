import { Request, Response, NextFunction } from 'express';
import prisma from '../utils/prisma';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

/**
 * Get 10 questions for a subject
 */
export const getQuestions = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { subject } = req.params;

    const validSubjects = ['fullstack', 'dbms', 'os'];
    if (!validSubjects.includes(subject)) {
        return next(new AppError('Invalid subject. Use: fullstack, dbms, os', 400));
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
            // Do NOT send correctAnswer to the client
        }
    });

    res.status(200).json({
        status: 'success',
        data: {
            questions,
        },
    });
});

/**
 * Submit quiz answers and calculate score
 * Body: { subject: string, answers: { questionId: string, selected: number }[] }
 */
export const submitQuiz = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { subject, answers } = req.body;

    if (!subject || !answers || !Array.isArray(answers)) {
        return next(new AppError('Subject and answers array are required', 400));
    }

    // Fetch correct answers for submitted questions
    const questionIds = answers.map((a: any) => a.questionId);
    const questions = await prisma.question.findMany({
        where: { id: { in: questionIds } },
    });

    if (questions.length === 0) {
        return next(new AppError('No valid questions found', 400));
    }

    // Calculate score
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
            correctAnswer: question?.correctAnswer 
        };
    });

    // Store result
    const quizResult = await prisma.quizResult.create({
        data: {
            userId: req.user.id,
            subject,
            score,
            total,
        },
    });

    res.status(200).json({
        status: 'success',
        data: {
            resultId: quizResult.id,
            score,
            total,
            percentage: Math.round((score / total) * 100),
            results,
        },
    });
});

/**
 * Get all quiz results for the authenticated user
 */
export const getResults = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const results = await prisma.quizResult.findMany({
        where: { userId: req.user.id },
        orderBy: { createdAt: 'desc' },
    });

    // Aggregate stats by subject
    const subjectStats: Record<string, { totalAttempts: number; avgScore: number; bestScore: number }> = {};
    results.forEach((r: any) => {
        if (!subjectStats[r.subject]) {
            subjectStats[r.subject] = { totalAttempts: 0, avgScore: 0, bestScore: 0 };
        }
        subjectStats[r.subject].totalAttempts++;
        subjectStats[r.subject].avgScore += r.score;
        subjectStats[r.subject].bestScore = Math.max(subjectStats[r.subject].bestScore, r.score);
    });

    // Calculate averages
    Object.keys(subjectStats).forEach(key => {
        subjectStats[key].avgScore = Math.round(
            (subjectStats[key].avgScore / subjectStats[key].totalAttempts) * 10
        ) / 10;
    });

    res.status(200).json({
        status: 'success',
        data: {
            results,
            subjectStats,
        },
    });
});
