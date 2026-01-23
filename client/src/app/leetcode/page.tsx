"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { toast } from "sonner";

export default function LeetCodePage() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [stats, setStats] = useState({ totalSolved: 0 });

    const fetchStats = async () => {
        try {
            const res = await api.get("/leetcode/stats");
            setSubmissions(res.data.data.recent);
            setStats({ totalSolved: res.data.data.totalSolved });
        } catch (error) {
            toast.error("Failed to fetch LeetCode stats");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleSync = async () => {
        setSyncing(true);
        try {
            const res = await api.post("/leetcode/sync");
            toast.success(res.data.message);
            fetchStats();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Sync failed");
        } finally {
            setSyncing(false);
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">LeetCode Activity</h2>
                    <p className="text-zinc-400">Sync your latest solutions and track progress.</p>
                </div>
                <Button onClick={handleSync} disabled={syncing} className="bg-emerald-600 hover:bg-emerald-700">
                    <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? "Syncing..." : "Sync Now"}
                </Button>
            </div>

            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                <Card className="bg-zinc-900 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle>Total Solved (Synced)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-bold text-emerald-500">{stats.totalSolved}</div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-zinc-900 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>Submission History</CardTitle>
                    <CardDescription>Your integrated timeline of problem solving.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {loading ? <p>Loading...</p> : submissions.length === 0 ? (
                            <p className="text-zinc-500">No submissions found. Try syncing.</p>
                        ) : (
                            submissions.map((sub: any) => (
                                <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg border-zinc-800 bg-zinc-950/50">
                                    <div className="flex items-center">
                                        {sub.status === 'ACCEPTED' ? (
                                            <CheckCircle2 className="mr-3 h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <XCircle className="mr-3 h-5 w-5 text-rose-500" />
                                        )}
                                        <div>
                                            <p className="font-medium text-lg">{sub.problemTitle}</p>
                                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${sub.difficulty === 'HARD' ? 'bg-red-900/30 text-red-400' :
                                                    sub.difficulty === 'MEDIUM' ? 'bg-yellow-900/30 text-yellow-400' :
                                                        'bg-green-900/30 text-green-400'
                                                    }`}>
                                                    {sub.difficulty}
                                                </span>
                                                <span>•</span>
                                                <span>{sub.language}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center text-zinc-500 text-sm">
                                        <Clock className="mr-2 h-4 w-4" />
                                        {new Date(sub.submittedAt).toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
