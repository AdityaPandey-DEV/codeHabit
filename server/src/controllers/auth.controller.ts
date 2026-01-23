import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod'; // Although I haven't installed zod explicitly in list, I installed it in package.json earlier
import prisma from '../utils/prisma';
import { catchAsync } from '../utils/catchAsync';
import { AppError } from '../utils/appError';

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '90d',
    });
};

const sendToken = (user: any, statusCode: number, res: Response) => {
    const token = signToken(user.id);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

export const register = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, leetcodeUsername } = req.body;

    // 1) Basic Validation
    if (!email || !password || !username) {
        return next(new AppError('Please provide username, email and password', 400));
    }

    // 2) Check if user exists
    const existingUser = await prisma.user.findFirst({
        where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
        return next(new AppError('Email or Username already in use', 400));
    }

    // 3) Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4) Create user
    const newUser = await prisma.user.create({
        data: {
            username,
            email,
            password: hashedPassword,
            leetcodeUsername,
        },
    });

    sendToken(newUser, 201, res);
});

export const login = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    // 2) Check if user exists & password is correct
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return next(new AppError('Incorrect email or password', 401));
    }

    // 3) If everything ok, send token
    sendToken(user, 200, res);
});
