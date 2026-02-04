"use client";

import { useState, useEffect } from "react";
import DiaryEditor from "@/components/diary/DiaryEditor";
import TaskList from "@/components/diary/TaskList";
import Timer from "@/components/Timer";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import api from "@/lib/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DiaryPage() {
    const router = useRouter();
    const [date, setDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);

    // Data State
    const [diaryEntry, setDiaryEntry] = useState("");
    const [tasks, setTasks] = useState([]);

    // TEMPORARY: I will write the component to fetch properly, assuming backend is fixed to take query param.
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // Assuming I'll fix backend to read query
                const res = await api.get(`/diary/${date.toISOString()}`);
                const data = res.data;
                setDiaryEntry(data.diaryEntry?.content || "");
                setTasks(data.tasks || []);
            } catch (e: any) {
                console.error(e);
                if (e.response?.status === 401) {
                    toast.error("Session expired");
                    router.push("/auth");
                } else {
                    // toast.error("Failed to load diary entry");
                }
            }
            setLoading(false);
        };
        load();
    }, [date, router]);

    return (
        <div className="container mx-auto p-6 space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Daily Journal & Planner</h1>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                {/* Left Column: Calendar & Timer */}
                <div className="md:col-span-4 space-y-6">
                    <Card>
                        <CardContent className="p-4 flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={(d) => d && setDate(d)}
                                className="rounded-md border shadow"
                            />
                        </CardContent>
                    </Card>

                    <div className="h-[300px]">
                        <Timer date={date} />
                    </div>
                </div>

                {/* Right Column: Diary & Tasks */}
                <div className="md:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
                        <DiaryEditor date={date} initialContent={diaryEntry} />
                        <TaskList date={date} initialTasks={tasks} />
                    </div>
                </div>
            </div>
        </div>
    );
}
