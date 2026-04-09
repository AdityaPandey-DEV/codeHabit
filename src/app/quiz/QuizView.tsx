"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { BrainCircuit, Clock, ChevronRight, ChevronLeft, CheckCircle, XCircle, Trophy, BookOpen, Database, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import { toast } from "sonner";

interface Question {
    id: string;
    subject: string;
    question: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string;
}

interface QuizResult {
    score: number;
    total: number;
    percentage: number;
    results: { questionId: string; correct: boolean; correctAnswer?: number }[];
}

type Phase = "select" | "quiz" | "result";

const SUBJECTS = [
    {
        id: "fullstack",
        label: "Full Stack Development",
        description: "React, Node.js, REST APIs, Databases & more",
        icon: BookOpen,
        color: "from-violet-600 to-purple-700",
        border: "border-violet-500/30 hover:border-violet-500/60",
        iconColor: "text-violet-400",
    },
    {
        id: "dbms",
        label: "Database Management",
        description: "SQL, Normalization, Transactions, Indexing & more",
        icon: Database,
        color: "from-emerald-600 to-teal-700",
        border: "border-emerald-500/30 hover:border-emerald-500/60",
        iconColor: "text-emerald-400",
    },
    {
        id: "os",
        label: "Operating Systems",
        description: "Scheduling, Memory, Synchronization & more",
        icon: Cpu,
        color: "from-amber-600 to-orange-700",
        border: "border-amber-500/30 hover:border-amber-500/60",
        iconColor: "text-amber-400",
    },
];

export default function QuizPage() {
    const router = useRouter();
    const [phase, setPhase] = useState<Phase>("select");
    const [subject, setSubject] = useState("");
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<QuizResult | null>(null);
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [timerActive, setTimerActive] = useState(false);

    // Timer
    useEffect(() => {
        if (!timerActive || timeLeft <= 0) return;
        const interval = setInterval(() => {
            setTimeLeft((t) => {
                if (t <= 1) {
                    clearInterval(interval);
                    handleSubmit();
                    return 0;
                }
                return t - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [timerActive]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const startQuiz = async (subjectId: string) => {
        setSubject(subjectId);
        setLoading(true);
        try {
            const res = await api.get(`/quiz/questions/${subjectId}`);
            setQuestions(res.data.data.questions);
            setAnswers({});
            setCurrentIndex(0);
            setTimeLeft(600);
            setPhase("quiz");
            setTimerActive(true);
        } catch (error) {
            toast.error("Failed to load questions");
        } finally {
            setLoading(false);
        }
    };

    const selectAnswer = (questionId: string, option: number) => {
        setAnswers((prev) => ({ ...prev, [questionId]: option }));
    };

    const handleSubmit = async () => {
        setTimerActive(false);
        setLoading(true);
        try {
            const answerArray = Object.entries(answers).map(([questionId, selected]) => ({
                questionId,
                selected,
            }));
            const res = await api.post("/quiz/submit", {
                subject,
                answers: answerArray,
            });
            setResult(res.data.data);
            setPhase("result");
        } catch (error) {
            toast.error("Failed to submit quiz");
        } finally {
            setLoading(false);
        }
    };

    const currentQuestion = questions[currentIndex];
    const isAnswered = currentQuestion && answers[currentQuestion.id] !== undefined;
    const answeredCount = Object.keys(answers).length;
    const timerDanger = timeLeft < 60;
    const timerWarning = timeLeft < 180 && !timerDanger;

    // ─── Subject Selection ─────────────────────
    if (phase === "select") {
        return (
            <div className="p-6 md:p-8 space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        Quiz Assessment
                    </h2>
                    <p className="text-zinc-400 mt-1">Test your knowledge in core CS subjects</p>
                </div>

                <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
                    {SUBJECTS.map((s) => (
                        <Card
                            key={s.id}
                            className={`bg-zinc-900/80 border-zinc-800 text-white cursor-pointer transition-all duration-300 ${s.border}`}
                            onClick={() => startQuiz(s.id)}
                        >
                            <CardContent className="p-6">
                                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4`}>
                                    <s.icon className="h-7 w-7 text-white" />
                                </div>
                                <h3 className="text-lg font-bold mb-1">{s.label}</h3>
                                <p className="text-sm text-zinc-400">{s.description}</p>
                                <div className="flex items-center gap-2 mt-4 text-xs text-zinc-500">
                                    <Clock className="h-3 w-3" />
                                    <span>10 minutes</span>
                                    <span>•</span>
                                    <BrainCircuit className="h-3 w-3" />
                                    <span>10 questions</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Results link */}
                <div className="flex justify-center">
                    <Button
                        className="bg-transparent border border-zinc-700 text-white hover:bg-zinc-800"
                        onClick={() => router.push("/quiz/results")}
                    >
                        <Trophy className="mr-2 h-4 w-4 text-amber-400" />
                        View Past Results
                    </Button>
                </div>
            </div>
        );
    }

    // ─── Quiz Interface ────────────────────────
    if (phase === "quiz" && currentQuestion) {
        return (
            <div className="p-6 md:p-8 space-y-6 max-w-3xl mx-auto">
                {/* Top bar */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full bg-zinc-800 text-xs font-medium text-zinc-300 capitalize">
                            {subject === 'fullstack' ? 'Full Stack' : subject === 'dbms' ? 'DBMS' : 'OS'}
                        </span>
                        <span className="text-sm text-zinc-400">
                            {currentIndex + 1} of {questions.length}
                        </span>
                    </div>
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
                        timerDanger ? 'bg-red-500/20 text-red-400 animate-pulse' :
                        timerWarning ? 'bg-amber-500/20 text-amber-400' :
                        'bg-zinc-800 text-zinc-300'
                    }`}>
                        <Clock className="h-4 w-4" />
                        <span className="font-mono font-bold text-sm">{formatTime(timeLeft)}</span>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-800 rounded-full h-1.5">
                    <div
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
                    />
                </div>

                {/* Question Card */}
                <Card className="bg-zinc-900/80 border-zinc-800 text-white">
                    <CardContent className="p-6 md:p-8">
                        <h3 className="text-lg md:text-xl font-semibold mb-6 leading-relaxed">
                            {currentQuestion.question}
                        </h3>
                        <div className="space-y-3">
                            {[
                                { num: 1, text: currentQuestion.option1 },
                                { num: 2, text: currentQuestion.option2 },
                                { num: 3, text: currentQuestion.option3 },
                                { num: 4, text: currentQuestion.option4 },
                            ].map((opt) => {
                                const isSelected = answers[currentQuestion.id] === opt.num;
                                return (
                                    <button
                                        key={opt.num}
                                        onClick={() => selectAnswer(currentQuestion.id, opt.num)}
                                        className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                                            isSelected
                                                ? 'border-violet-500 bg-violet-500/10 text-white'
                                                : 'border-zinc-700 bg-zinc-800/50 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800'
                                        }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
                                                isSelected ? 'bg-violet-500 text-white' : 'bg-zinc-700 text-zinc-400'
                                            }`}>
                                                {String.fromCharCode(64 + opt.num)}
                                            </span>
                                            <span className="text-sm md:text-base">{opt.text}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                        disabled={currentIndex === 0}
                        className="bg-transparent border border-zinc-700 text-white hover:bg-zinc-800"
                    >
                        <ChevronLeft className="mr-1 h-4 w-4" /> Previous
                    </Button>

                    <div className="flex gap-1">
                        {questions.map((q, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentIndex(i)}
                                className={`w-8 h-8 rounded-full text-xs font-bold transition-all ${
                                    i === currentIndex
                                        ? 'bg-violet-500 text-white scale-110'
                                        : answers[q.id] !== undefined
                                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : 'bg-zinc-800 text-zinc-500'
                                }`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>

                    {currentIndex === questions.length - 1 ? (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-emerald-600 hover:bg-emerald-700"
                        >
                            {loading ? "Submitting..." : `Submit (${answeredCount}/${questions.length})`}
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setCurrentIndex(Math.min(questions.length - 1, currentIndex + 1))}
                            className="bg-violet-600 hover:bg-violet-700"
                        >
                            Next <ChevronRight className="ml-1 h-4 w-4" />
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    // ─── Result Screen ─────────────────────────
    if (phase === "result" && result) {
        const isPassing = result.percentage >= 50;
        return (
            <div className="p-6 md:p-8 space-y-6 max-w-2xl mx-auto">
                <div className="text-center space-y-4">
                    <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${
                        isPassing ? 'bg-emerald-500/20' : 'bg-red-500/20'
                    }`}>
                        {isPassing ? (
                            <Trophy className="h-12 w-12 text-emerald-400" />
                        ) : (
                            <XCircle className="h-12 w-12 text-red-400" />
                        )}
                    </div>
                    <h2 className="text-3xl font-bold">
                        {isPassing ? "Great Job! 🎉" : "Keep Practicing! 💪"}
                    </h2>
                    <p className="text-zinc-400">
                        {subject === 'fullstack' ? 'Full Stack Development' : subject === 'dbms' ? 'DBMS' : 'Operating Systems'}
                    </p>
                </div>

                {/* Score display */}
                <Card className="bg-zinc-900/80 border-zinc-800 text-white">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-center gap-8">
                            <div className="text-center">
                                <p className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                                    {result.score}
                                </p>
                                <p className="text-sm text-zinc-400 mt-1">out of {result.total}</p>
                            </div>
                            <div className="h-16 w-px bg-zinc-700" />
                            <div className="text-center">
                                <p className={`text-5xl font-bold ${isPassing ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {result.percentage}%
                                </p>
                                <p className="text-sm text-zinc-400 mt-1">Score</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Question-wise results */}
                <Card className="bg-zinc-900/80 border-zinc-800 text-white">
                    <CardHeader>
                        <CardTitle className="text-sm">Question-wise Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-5 gap-2">
                            {result.results.map((r, i) => (
                                <div
                                    key={i}
                                    className={`flex items-center justify-center h-10 rounded-lg text-sm font-bold ${
                                        r.correct
                                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                            : 'bg-red-500/20 text-red-400 border border-red-500/30'
                                    }`}
                                >
                                    {r.correct ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                                    <span className="ml-1">Q{i + 1}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3">
                    <Button
                        className="bg-transparent border border-zinc-700 text-white hover:bg-zinc-800"
                        onClick={() => {
                            setPhase("select");
                            setResult(null);
                        }}
                    >
                        Try Another Subject
                    </Button>
                    <Button
                        className="bg-violet-600 hover:bg-violet-700"
                        onClick={() => startQuiz(subject)}
                    >
                        Retake Quiz
                    </Button>
                    <Button
                        variant="outline"
                        className="bg-white text-black border-white hover:bg-zinc-200"
                        onClick={() => router.push("/quiz/results")}
                    >
                        View All Results
                    </Button>
                </div>
            </div>
        );
    }

    return null;
}
