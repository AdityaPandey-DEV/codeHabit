import { NextRequest } from 'next/server';
import { LeetCodeFetcher } from '@/lib/leetcode';

export async function GET(request: NextRequest, { params }: { params: Promise<{ username: string }> }) {
    const { username } = await params;

    try {
        // Fetch profile stats
        const profileData = await LeetCodeFetcher.getUserProfile(username);
        const allQuestions = profileData.allQuestionsCount;
        const solvedStats = profileData.matchedUser?.submitStatsGlobal?.acSubmissionNum;

        if (!solvedStats) {
            return Response.json({ status: 'error', message: 'LeetCode user not found' }, { status: 404 });
        }

        const getSolved = (diff: string) => solvedStats.find((s: any) => s.difficulty === diff)?.count || 0;
        const getTotal = (diff: string) => allQuestions.find((q: any) => q.difficulty === diff)?.count || 0;

        const profile = {
            totalSolved: getSolved('All'),
            easySolved: getSolved('Easy'),
            mediumSolved: getSolved('Medium'),
            hardSolved: getSolved('Hard'),
            easyTotal: getTotal('Easy'),
            mediumTotal: getTotal('Medium'),
            hardTotal: getTotal('Hard'),
            ranking: profileData.matchedUser?.profile?.ranking || 0,
        };

        // Fetch submission calendar
        const calendarJson = await LeetCodeFetcher.getSubmissionCalendar(username);
        let calendar: { date: string; count: number }[] = [];
        let currentStreak = 0;

        if (calendarJson) {
            const calendarData = JSON.parse(calendarJson);
            calendar = Object.entries(calendarData).map(([timestamp, count]: [string, any]) => {
                const d = new Date(parseInt(timestamp) * 1000);
                return {
                    date: d.toISOString().split('T')[0],
                    count: count as number,
                };
            });

            // Calculate current streak
            const today = new Date();
            for (let i = 0; i < 365; i++) {
                const d = new Date(today);
                d.setDate(d.getDate() - i);
                const dateStr = d.toISOString().split('T')[0];
                const entry = calendar.find((c: any) => c.date === dateStr);
                if (entry && entry.count > 0) {
                    currentStreak++;
                } else if (i > 0) {
                    break;
                }
            }
        }

        return Response.json({
            status: 'success',
            data: { profile, calendar, currentStreak },
        });
    } catch (error: any) {
        return Response.json({ status: 'error', message: error.message }, { status: 500 });
    }
}
