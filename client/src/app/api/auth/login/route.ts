import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return Response.json({ status: 'error', message: 'Please provide email and password' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return Response.json({ status: 'error', message: 'Incorrect email or password' }, { status: 401 });
        }

        const token = signToken(user.id);
        const { password: _, ...userWithoutPassword } = user;

        return Response.json({ status: 'success', token, data: { user: userWithoutPassword } }, { status: 200 });
    } catch (error: any) {
        return Response.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
