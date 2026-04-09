import { NextRequest } from 'next/server';
import { getAuthUser, jsonError } from '@/lib/auth';

export async function GET(request: NextRequest) {
    const user = await getAuthUser(request);
    if (!user) return jsonError('Not authenticated', 401);

    const { password: _, ...userWithoutPassword } = user;
    return Response.json({ status: 'success', data: { user: userWithoutPassword } });
}
