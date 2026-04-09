import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { username, email, password, leetcodeUsername } = await request.json();

        if (!email || !password || !username) {
            return Response.json({ status: 'error', message: 'Please provide username, email and password' }, { status: 400 });
        }

        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] },
        });

        if (existingUser) {
            return Response.json({ status: 'error', message: 'Email or Username already in use' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const newUser = await prisma.user.create({
            data: { username, email, password: hashedPassword, leetcodeUsername },
        });

        const token = signToken(newUser.id);
        const { password: _, ...userWithoutPassword } = newUser;

        return Response.json({ status: 'success', token, data: { user: userWithoutPassword } }, { status: 201 });
    } catch (error: any) {
        return Response.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
