"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import { CheckCircle2, XCircle, Code, Activity, BrainCircuit } from "lucide-react";
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

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);
  const [recentSubs, setRecentSubs] = useState<any[]>([]);

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

        // Transform for Recharts
        const chartData = dates.map((date: string, i: number) => ({
          date: date.substring(5), // MM-DD
          habits: habitCounts[i],
          problems: problemCounts[i],
        }));

        setData({ correlation, insight, summary, chartData });

        // Fetch Recent Submissions
        const leetCodeRes = await api.get("/leetcode/stats");
        setRecentSubs(leetCodeRes.data.data.recent.slice(0, 5));

      } catch (error: any) {
        console.error("Failed to load dashboard data", error);
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

  if (loading) return <div className="p-8 text-white">Loading dashboard...</div>;
  if (!data) return null;

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <p className="text-zinc-400">Your daily performance overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="border border-zinc-700 bg-transparent text-white hover:bg-zinc-800" onClick={() => router.push('/habits')}>Manage Habits</Button>
          <Button className="bg-white text-black hover:bg-zinc-200" onClick={() => window.location.reload()}>Refresh Data</Button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habits (30d)</CardTitle>
            <Activity className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalHabitsLast30Days}</div>
            <p className="text-xs text-zinc-400">Total completed actions</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problems Solved</CardTitle>
            <Code className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.summary.totalProblemsSolvedLast30Days}</div>
            <p className="text-xs text-zinc-400">LeetCode Accepted</p>
          </CardContent>
        </Card>
        <Card className="bg-zinc-900 border-zinc-800 text-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Correlation Score</CardTitle>
            <BrainCircuit className="h-4 w-4 text-sky-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.correlation}</div>
            <p className="text-xs text-zinc-400">Pearson Coefficient</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-violet-900/50 to-indigo-900/50 border-violet-500/30 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-violet-200">AI Insight</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-tight">{data.insight}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-7">
        <Card className="col-span-4 bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Performance Correlation</CardTitle>
            <CardDescription>Visualizing the link between your habits and coding output.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data.chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#888" fontSize={12} />
                  <YAxis yAxisId="left" stroke="#888" fontSize={12} />
                  <YAxis yAxisId="right" orientation="right" stroke="#888" fontSize={12} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend />
                  <Bar yAxisId="left" dataKey="habits" name="Habits Completed" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={20} />
                  <Line yAxisId="right" type="monotone" dataKey="problems" name="Problems Solved" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="col-span-3 bg-zinc-900 border-zinc-800 text-white">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest LeetCode submissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                    <div className="ml-auto font-medium text-xs text-zinc-500">
                      {sub.difficulty || 'MEDIUM'}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
