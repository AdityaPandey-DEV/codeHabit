"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";
import { CheckCircle2, XCircle, Code, Activity, BrainCircuit, Flame, Trophy, Target, TrendingUp } from "lucide-react";
import { Heatmap } from "@/components/Heatmap";
import api from "@/lib/api";
import { toast } from "sonner";

interface DashboardData {
  correlation: number;
  insight: string;
  summary: {
    totalHabitsLast30Days: number;
    totalProblemsSolvedLast30Days: number;
  };
  chartData: any[];
}

interface LeetCodeProfile {
  totalSolved: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  easyTotal: number;
  mediumTotal: number;
  hardTotal: number;
  ranking: number;
}

const DIFFICULTY_COLORS = ["#00b8a3", "#ffc01e", "#ef4743"];

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [recentSubs, setRecentSubs] = useState<any[]>([]);
  const [profile, setProfile] = useState<LeetCodeProfile | null>(null);
  const [heatmapData, setHeatmapData] = useState<{ date: string; count: number }[]>([]);
  const [leetcodeStreak, setLeetcodeStreak] = useState(0);
  const [quizStats, setQuizStats] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          router.push("/auth");
          return;
        }

        // Fetch Analytics
        const analyticsRes = await api.get("/analytics/dashboard");
        const { dates, habitCounts, problemCounts, correlation, insight, summary } = analyticsRes.data.data;

        const chartData = dates.map((date: string, i: number) => ({
          date: date.substring(5),
          habits: habitCounts[i],
          problems: problemCounts[i],
        }));

        setData({ correlation, insight, summary, chartData });

        // Fetch Recent Submissions
        try {
          const leetCodeRes = await api.get("/leetcode/stats");
          setRecentSubs(leetCodeRes.data.data.recent.slice(0, 5));
        } catch {}

        // Fetch LeetCode profile (try to get username from user data)
        try {
          const userRes = await api.get("/auth/me");
          const leetcodeUsername = userRes.data?.data?.user?.leetcodeUsername;
          if (leetcodeUsername) {
            const profileRes = await api.get(`/leetcode/profile/${leetcodeUsername}`);
            setProfile(profileRes.data.data.profile);
            setHeatmapData(profileRes.data.data.calendar);
            setLeetcodeStreak(profileRes.data.data.currentStreak);
          }
        } catch {}

        // Fetch quiz results
        try {
          const quizRes = await api.get("/quiz/results");
          setQuizStats(quizRes.data.data);
        } catch {}

      } catch (error: any) {
        if (error.response?.status === 401) {
          toast.error("Session expired");
          router.push("/auth");
        } else {
          toast.error("Failed to load data. Make sure backend is running.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 border-2 border-[#0f766e] border-t-transparent rounded-full animate-spin" />
          <p className="text-[#617079]">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  if (!data) return null;

  const pieData = profile ? [
    { name: "Easy", value: profile.easySolved, total: profile.easyTotal },
    { name: "Medium", value: profile.mediumSolved, total: profile.mediumTotal },
    { name: "Hard", value: profile.hardSolved, total: profile.hardTotal },
  ] : [];

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-5 sm:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">Dashboard</h2>
          <p className="mt-1 text-[#617079]">Review the activity you have recorded across habits, coding, and study.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-[#9caeb2] bg-white text-[#15212b] hover:bg-[#eef3f2]" onClick={() => router.push('/habits')}>Manage habits</Button>
          <Button className="bg-[#0f766e] text-white hover:bg-[#0b5f58]" onClick={() => router.push('/quiz')}>Take quiz</Button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-[#dbe2e5] bg-white text-[#15212b]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habits (30d)</CardTitle>
            <Activity className="h-4 w-4 text-[#0f766e]" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{data.summary.totalHabitsLast30Days}</div>
            <p className="mt-1 text-xs text-[#617079]">Recorded in the last 30 days</p>
          </CardContent>
        </Card>
        <Card className="border-[#dbe2e5] bg-white text-[#15212b]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
            <Code className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-[#2563eb]">{profile?.totalSolved || data.summary.totalProblemsSolvedLast30Days}</div>
            <p className="mt-1 text-xs text-[#617079]">{profile ? "Total shown by LeetCode" : "Accepted in the last 30 days"}</p>
          </CardContent>
        </Card>
        <Card className="border-[#dbe2e5] bg-white text-[#15212b]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Flame className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-400">{leetcodeStreak}</div>
            <p className="mt-1 text-xs text-[#617079]">Consecutive days recorded</p>
          </CardContent>
        </Card>
        <Card className="border-[#c7ded9] bg-[#f1faf8] text-[#15212b]">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-[#173a38]">
              <BrainCircuit className="h-4 w-4" /> Pattern to review
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{data.insight}</p>
            <p className="mt-2 text-xs text-[#52626b]">Correlation: {data.correlation}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-7">
        <Card className="col-span-1 border-[#dbe2e5] bg-white text-[#15212b] lg:col-span-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#0f766e]" />
              Habit and coding activity
            </CardTitle>
            <CardDescription>Your saved activity by day over the last 30 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dbe2e5" />
                  <XAxis dataKey="date" stroke="#617079" fontSize={11} />
                  <YAxis yAxisId="left" stroke="#617079" fontSize={11} />
                  <YAxis yAxisId="right" orientation="right" stroke="#617079" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #dbe2e5', borderRadius: '6px' }}
                    itemStyle={{ color: '#15212b' }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="habits" name="Habits" fill="#0f766e" radius={[3, 3, 0, 0]} barSize={16} />
                  <Line yAxisId="right" type="monotone" dataKey="problems" name="Problems" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: '#2563eb' }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* LeetCode Profile Card or Recent Activity */}
        <Card className="col-span-1 border-[#dbe2e5] bg-white text-[#15212b] lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-amber-500" />
              {profile ? "LeetCode Profile" : "Recent Activity"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profile ? (
              <div className="space-y-4">
                {/* Mini Donut */}
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <PieChart width={160} height={160}>
                      <Pie
                        data={pieData}
                        cx={80}
                        cy={80}
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={DIFFICULTY_COLORS[i]} />
                        ))}
                      </Pie>
                    </PieChart>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-2xl font-bold">{profile.totalSolved}</span>
                      <span className="text-xs text-zinc-400">Solved</span>
                    </div>
                  </div>
                </div>
                {/* Difficulty breakdown */}
                <div className="space-y-2">
                  {[
                    { label: "Easy", solved: profile.easySolved, total: profile.easyTotal, color: "bg-teal-500" },
                    { label: "Medium", solved: profile.mediumSolved, total: profile.mediumTotal, color: "bg-amber-500" },
                    { label: "Hard", solved: profile.hardSolved, total: profile.hardTotal, color: "bg-red-500" },
                  ].map((d) => (
                    <div key={d.label} className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 w-14">{d.label}</span>
                      <div className="flex-1 bg-zinc-800 rounded-full h-2 overflow-hidden">
                        <div className={`h-full ${d.color} rounded-full transition-all duration-500`} style={{ width: `${d.total > 0 ? (d.solved / d.total) * 100 : 0}%` }} />
                      </div>
                      <span className="text-xs text-zinc-400 w-16 text-right">{d.solved}/{d.total}</span>
                    </div>
                  ))}
                </div>
                {profile.ranking > 0 && (
                  <p className="text-xs text-zinc-500 text-center">Ranking: #{profile.ranking.toLocaleString()}</p>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                {recentSubs.length === 0 ? (
                  <p className="text-sm text-zinc-500">No recent activity synced.</p>
                ) : (
                  recentSubs.map((sub: any) => (
                    <div key={sub.id} className="flex items-center">
                      {sub.status === 'ACCEPTED' ? (
                        <CheckCircle2 className="mr-2 h-4 w-4 text-emerald-500" />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4 text-rose-500" />
                      )}
                      <div className="ml-2 space-y-1 flex-1">
                        <p className="text-sm font-medium leading-none">{sub.problemTitle}</p>
                        <p className="text-xs text-zinc-400">{sub.language} • {new Date(sub.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Heatmap Row */}
      {heatmapData.length > 0 && (
        <Card className="bg-zinc-900/80 border-zinc-800 text-white backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              LeetCode Activity — Past Year
            </CardTitle>
            <CardDescription>Yearly submission heatmap</CardDescription>
          </CardHeader>
          <CardContent>
            <Heatmap data={heatmapData} />
          </CardContent>
        </Card>
      )}

      {/* Quiz Stats Row */}
      {quizStats && quizStats.results && quizStats.results.length > 0 && (
        <Card className="bg-zinc-900/80 border-zinc-800 text-white backdrop-blur">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-amber-500" />
              Recent Quiz Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(quizStats.subjectStats || {}).map(([subject, stats]: [string, any]) => (
                <div key={subject} className="bg-zinc-800/50 rounded-lg p-4 border border-zinc-700/50">
                  <h4 className="text-sm font-medium capitalize mb-2">
                    {subject === 'fullstack' ? 'Full Stack Development' : subject === 'dbms' ? 'DBMS' : 'Operating Systems'}
                  </h4>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-amber-400">{stats.bestScore}</span>
                    <span className="text-sm text-zinc-400 mb-1">/10 best</span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-1">{stats.totalAttempts} attempt{stats.totalAttempts !== 1 ? 's' : ''} • Avg: {stats.avgScore}/10</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
