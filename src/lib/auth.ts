import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export function signToken(id: string) {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '90d' });
}

export async function getAuthUser(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string };
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        return user;
    } catch {
        return null;
    }
}

export function jsonError(message: string, status: number) {
    return Response.json({ status: 'error', message }, { status });
}
