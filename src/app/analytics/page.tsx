"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, ComposedChart, Line, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from "recharts";
import api from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface AnalyticsData {
    correlation: number;
    insight: string;
    chartData: any[];
    summary: {
        totalHabitsLast30Days: number;
        totalProblemsSolvedLast30Days: number;
    };
}

export default function AnalyticsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<AnalyticsData | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await api.get("/analytics/dashboard");
                const { dates, habitCounts, problemCounts, correlation, insight, summary } = res.data.data;

                const chartData = dates.map((date: string, i: number) => ({
                    date: date.substring(5),
                    habits: habitCounts[i],
                    problems: problemCounts[i],
                }));

                setData({ correlation, insight, chartData, summary });
            } catch (error) {
                toast.error("Failed to fetch analytics");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="p-8">Loading analytics...</div>;
    if (!data) return null;

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Analytics Deep Dive</h2>
                    <p className="text-zinc-400">Detailed breakdown of your performance metrics.</p>
                </div>
                <Button className="border border-zinc-700 bg-transparent text-white hover:bg-zinc-800" onClick={() => window.location.reload()}>Refresh</Button>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                {/* Insight Card */}
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle>AI Insight</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-lg font-medium text-violet-400 mb-2">
                            Correlation Score: {data.correlation}
                        </div>
                        <p className="text-zinc-300">{data.insight}</p>
                    </CardContent>
                </Card>

                {/* Summary Stats */}
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle>30 Day Summary</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-zinc-400">Total Habits Completed</span>
                            <span className="text-2xl font-bold">{data.summary.totalHabitsLast30Days}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-zinc-400">LeetCode Problems Solved</span>
                            <span className="text-2xl font-bold">{data.summary.totalProblemsSolvedLast30Days}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Chart */}
            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>Habit vs Coding Trends</CardTitle>
                    <CardDescription>30-day historical view.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px] w-full">
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
        </div>
    );
}
