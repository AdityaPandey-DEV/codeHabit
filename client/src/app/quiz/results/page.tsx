"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Trophy, Calendar, ArrowLeft, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { toast } from "sonner";

interface Result {
    id: string;
    subject: string;
    score: number;
    total: number;
    createdAt: string;
}

interface SubjectStats {
    totalAttempts: number;
    avgScore: number;
    bestScore: number;
}

const SUBJECT_LABELS: Record<string, string> = {
    fullstack: "Full Stack Development",
    dbms: "Database Management",
    os: "Operating Systems",
};

const SUBJECT_COLORS: Record<string, string> = {
    fullstack: "from-violet-600 to-purple-700",
    dbms: "from-emerald-600 to-teal-700",
    os: "from-amber-600 to-orange-700",
};

export default function ResultsPage() {
    const router = useRouter();
    const [results, setResults] = useState<Result[]>([]);
    const [subjectStats, setSubjectStats] = useState<Record<string, SubjectStats>>({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const res = await api.get("/quiz/results");
                setResults(res.data.data.results);
                setSubjectStats(res.data.data.subjectStats);
            } catch (error) {
                toast.error("Failed to load results");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        Quiz Results
                    </h2>
                    <p className="text-zinc-400 mt-1">Your assessment history and performance</p>
                </div>
                <Button
                    variant="outline"
                    className="border-zinc-700 text-white hover:bg-zinc-800"
                    onClick={() => router.push("/quiz")}
                >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Take Quiz
                </Button>
            </div>

            {/* Subject Stats Cards */}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                {Object.entries(subjectStats).map(([subject, stats]) => (
                    <Card key={subject} className="bg-zinc-900/80 border-zinc-800 text-white overflow-hidden">
                        <div className={`h-1.5 bg-gradient-to-r ${SUBJECT_COLORS[subject] || 'from-zinc-600 to-zinc-700'}`} />
                        <CardContent className="p-5">
                            <h3 className="font-semibold mb-3">{SUBJECT_LABELS[subject] || subject}</h3>
                            <div className="grid grid-cols-3 gap-3">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-emerald-400">{stats.bestScore}/10</p>
                                    <p className="text-xs text-zinc-500">Best</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-amber-400">{stats.avgScore}</p>
                                    <p className="text-xs text-zinc-500">Average</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-violet-400">{stats.totalAttempts}</p>
                                    <p className="text-xs text-zinc-500">Attempts</p>
                                </div>
                            </div>
                            {/* Score bar */}
                            <div className="mt-3">
                                <div className="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
                                    <div
                                        className={`h-full bg-gradient-to-r ${SUBJECT_COLORS[subject] || 'from-zinc-500 to-zinc-600'} rounded-full transition-all duration-500`}
                                        style={{ width: `${(stats.bestScore / 10) * 100}%` }}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {Object.keys(subjectStats).length === 0 && (
                <div className="text-center py-12 text-zinc-500">
                    <Trophy className="h-12 w-12 mx-auto mb-4 text-zinc-700" />
                    <p className="text-lg font-medium">No quiz results yet</p>
                    <p className="text-sm mt-1">Take a quiz to see your results here!</p>
                </div>
            )}

            {/* Results Table */}
            {results.length > 0 && (
                <Card className="bg-zinc-900/80 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart2 className="h-5 w-5 text-violet-400" />
                            Attempt History
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-zinc-800 text-zinc-400 text-sm">
                                        <th className="text-left py-3 px-2">#</th>
                                        <th className="text-left py-3 px-2">Subject</th>
                                        <th className="text-left py-3 px-2">Score</th>
                                        <th className="text-left py-3 px-2">Percentage</th>
                                        <th className="text-left py-3 px-2">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {results.map((r, i) => {
                                        const pct = Math.round((r.score / r.total) * 100);
                                        return (
                                            <tr key={r.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                                                <td className="py-3 px-2 text-zinc-500 text-sm">{i + 1}</td>
                                                <td className="py-3 px-2">
                                                    <span className="text-sm font-medium">{SUBJECT_LABELS[r.subject] || r.subject}</span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className="text-sm font-bold">{r.score}/{r.total}</span>
                                                </td>
                                                <td className="py-3 px-2">
                                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                                                        pct >= 70 ? 'bg-emerald-500/20 text-emerald-400' :
                                                        pct >= 40 ? 'bg-amber-500/20 text-amber-400' :
                                                        'bg-red-500/20 text-red-400'
                                                    }`}>
                                                        {pct}%
                                                    </span>
                                                </td>
                                                <td className="py-3 px-2 text-sm text-zinc-400 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {new Date(r.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
