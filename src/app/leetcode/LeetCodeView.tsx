"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, CheckCircle2, XCircle, Clock, Flame, Trophy, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Heatmap } from "@/components/Heatmap";
import api from "@/lib/api";
import { toast } from "sonner";

interface Profile {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    easyTotal: number;
    mediumTotal: number;
    hardTotal: number;
    ranking: number;
}

export default function LeetCodePage() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [stats, setStats] = useState({ totalSolved: 0 });
    const [profile, setProfile] = useState<Profile | null>(null);
    const [heatmapData, setHeatmapData] = useState<{ date: string; count: number }[]>([]);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [username, setUsername] = useState("");
    const [loadingProfile, setLoadingProfile] = useState(false);

    const fetchStats = async () => {
        try {
            const res = await api.get("/leetcode/stats");
            setSubmissions(res.data.data.recent);
            setStats({ totalSolved: res.data.data.totalSolved });
        } catch (error) {
            // silently fail if no data
        } finally {
            setLoading(false);
        }
    };

    const fetchProfile = async (uname: string) => {
        if (!uname) return;
        setLoadingProfile(true);
        try {
            const res = await api.get(`/leetcode/profile/${uname}`);
            setProfile(res.data.data.profile);
            setHeatmapData(res.data.data.calendar);
            setCurrentStreak(res.data.data.currentStreak);
        } catch (error: any) {
            toast.error("Failed to fetch LeetCode profile. Check username.");
        } finally {
            setLoadingProfile(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Try to auto-fetch profile
        const autoFetch = async () => {
            try {
                const userRes = await api.get("/auth/me");
                const lcUsername = userRes.data?.data?.user?.leetcodeUsername;
                if (lcUsername) {
                    setUsername(lcUsername);
                    fetchProfile(lcUsername);
                }
            } catch {}
        };
        autoFetch();
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
        <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        LeetCode Activity
                    </h2>
                    <p className="text-zinc-400 mt-1">Track your coding journey across the year</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="LeetCode username"
                            className="w-40 bg-zinc-900 border-zinc-700 text-sm"
                            onKeyDown={(e) => e.key === 'Enter' && fetchProfile(username)}
                        />
                        <Button
                            onClick={() => fetchProfile(username)}
                            disabled={loadingProfile || !username}
                            className="bg-transparent border border-zinc-700 text-white hover:bg-zinc-800"
                        >
                            {loadingProfile ? "Loading..." : "Fetch"}
                        </Button>
                    </div>
                    <Button onClick={handleSync} disabled={syncing} className="bg-emerald-600 hover:bg-emerald-700">
                        <RefreshCw className={`mr-2 h-4 w-4 ${syncing ? 'animate-spin' : ''}`} />
                        {syncing ? "Syncing..." : "Sync"}
                    </Button>
                </div>
            </div>

            {/* Profile Stats */}
            {profile && (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                    <Card className="bg-zinc-900/80 border-zinc-800 text-white hover:border-emerald-500/30 transition-all">
                        <CardContent className="p-4 flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-emerald-500/10">
                                <Trophy className="h-5 w-5 text-emerald-400" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-emerald-400">{profile.totalSolved}</p>
                                <p className="text-xs text-zinc-400">Total Solved</p>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900/80 border-zinc-800 text-white hover:border-teal-500/30 transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-teal-400">{profile.easySolved}</p>
                                    <p className="text-xs text-zinc-400">Easy ({profile.easyTotal})</p>
                                </div>
                                <div className="w-12 h-12 rounded-full border-3 border-teal-500 flex items-center justify-center">
                                    <span className="text-xs font-bold text-teal-400">{profile.easyTotal > 0 ? Math.round(profile.easySolved / profile.easyTotal * 100) : 0}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900/80 border-zinc-800 text-white hover:border-amber-500/30 transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-amber-400">{profile.mediumSolved}</p>
                                    <p className="text-xs text-zinc-400">Medium ({profile.mediumTotal})</p>
                                </div>
                                <div className="w-12 h-12 rounded-full border-3 border-amber-500 flex items-center justify-center">
                                    <span className="text-xs font-bold text-amber-400">{profile.mediumTotal > 0 ? Math.round(profile.mediumSolved / profile.mediumTotal * 100) : 0}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-zinc-900/80 border-zinc-800 text-white hover:border-red-500/30 transition-all">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-2xl font-bold text-red-400">{profile.hardSolved}</p>
                                    <p className="text-xs text-zinc-400">Hard ({profile.hardTotal})</p>
                                </div>
                                <div className="w-12 h-12 rounded-full border-3 border-red-500 flex items-center justify-center">
                                    <span className="text-xs font-bold text-red-400">{profile.hardTotal > 0 ? Math.round(profile.hardSolved / profile.hardTotal * 100) : 0}%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Difficulty Progress Bars */}
            {profile && (
                <Card className="bg-zinc-900/80 border-zinc-800 text-white">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Flame className="h-5 w-5 text-orange-400" />
                                <span className="font-medium">Current Streak: <span className="text-orange-400">{currentStreak} days</span></span>
                            </div>
                            {profile.ranking > 0 && (
                                <span className="text-sm text-zinc-400">Rank: #{profile.ranking.toLocaleString()}</span>
                            )}
                        </div>
                        {[
                            { label: "Easy", solved: profile.easySolved, total: profile.easyTotal, color: "bg-teal-500", text: "text-teal-400" },
                            { label: "Medium", solved: profile.mediumSolved, total: profile.mediumTotal, color: "bg-amber-500", text: "text-amber-400" },
                            { label: "Hard", solved: profile.hardSolved, total: profile.hardTotal, color: "bg-red-500", text: "text-red-400" },
                        ].map((d) => (
                            <div key={d.label}>
                                <div className="flex items-center justify-between mb-1">
                                    <span className={`text-sm font-medium ${d.text}`}>{d.label}</span>
                                    <span className="text-sm text-zinc-400">{d.solved} / {d.total}</span>
                                </div>
                                <div className="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
                                    <div
                                        className={`h-full ${d.color} rounded-full transition-all duration-700 ease-out`}
                                        style={{ width: `${d.total > 0 ? (d.solved / d.total) * 100 : 0}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            )}

            {/* Yearly Heatmap */}
            {heatmapData.length > 0 && (
                <Card className="bg-zinc-900/80 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="h-5 w-5 text-emerald-500" />
                            Yearly Submission Heatmap
                        </CardTitle>
                        <CardDescription>Your LeetCode activity over the past year (365 days)</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Heatmap data={heatmapData} />
                    </CardContent>
                </Card>
            )}

            {/* Submission History */}
            <Card className="bg-zinc-900/80 border-zinc-800 text-white">
                <CardHeader>
                    <CardTitle>Submission History</CardTitle>
                    <CardDescription>Your synced problem-solving timeline</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : submissions.length === 0 ? (
                            <div className="text-center py-8 text-zinc-500">
                                <p>No submissions found. Try syncing your LeetCode data.</p>
                            </div>
                        ) : (
                            submissions.map((sub: any) => (
                                <div key={sub.id} className="flex items-center justify-between p-4 border rounded-lg border-zinc-800 bg-zinc-950/50 hover:border-zinc-700 transition-all">
                                    <div className="flex items-center">
                                        {sub.status === 'ACCEPTED' ? (
                                            <CheckCircle2 className="mr-3 h-5 w-5 text-emerald-500" />
                                        ) : (
                                            <XCircle className="mr-3 h-5 w-5 text-rose-500" />
                                        )}
                                        <div>
                                            <p className="font-medium">{sub.problemTitle}</p>
                                            <div className="flex items-center gap-2 text-sm text-zinc-400">
                                                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                                                    sub.difficulty === 'HARD' ? 'bg-red-900/30 text-red-400' :
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
