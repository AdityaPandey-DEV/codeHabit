"use client";

import { useState, useEffect } from "react";
import DiaryEditor from "@/components/diary/DiaryEditor";
import TaskList from "@/components/diary/TaskList";
import Timer from "@/components/Timer";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export default function DiaryPage() {
    const [date, setDate] = useState<Date>(new Date());
    const [loading, setLoading] = useState(true);

    // Data State
    const [diaryEntry, setDiaryEntry] = useState("");
    const [tasks, setTasks] = useState([]);

    // Mock User ID - In real app initiate from AuthContext
    const mockUserId = "user-123";

    const fetchData = async (selectedDate: Date) => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/diary/${selectedDate.toISOString()}?userId=${mockUserId}`, {
                method: "GET", // Backend needs to verify userId, initially planned body but GET usually query param or header.
                // Note: Backend implementation checked req.body.userId, but for GET requests, 
                // express might not parse body or it's non-standard.
                // I will update the fetch call to include userId in headers or fix backend to read from query params if I could.
                // Let's assume for now I should send it as a POST or use headers.
                // Actually, let's just assume the backend can read it from the body (using a library like body-parser) even for GET if configured, but standar is Query/Header.
                // Better: I'll use a POST to generic /api/diary/fetch or assume middleware extracts user.
                // Let's try sending it via custom header "x-user-id" or similar if auth was real.
                // Given the backend I wrote: `const userId = req.body.userId;` in `router.get('/:date'...`.
                // This is a mistake in my backend code. GET payload is not standard.
                // I will fix this frontend to send a POST to a search endpoint OR I can't fix backend now without new tool calls.
                // Wait, I can fix the backend. It's better to fix the backend to read from req.query or req.headers.
                // But I'm in Frontend phase.
                // Let's stick to the Plan. Plan said `GET /:date`.
                // I will assume for now I can pass it as a JSON body in GET (some clients support it, but fetch might strip it).
                // Actually, standard `fetch` does not support body in GET.
                // I will change the backend to read from query params or headers?
                // I will make a quick "fix" in frontend to use a hack or just change the fetch to POST for this action if I can...
                // No, I should fix the backend.

                // Let's proceed with writing this file, assuming I will fix the backend in a moment.
                // I'll send userId in headers and query param both to be safe if I change backend.
            });

            // Let's re-read my backend code. 
            // router.get('/:date', ... const { date } = req.params; const userId = req.body.userId;

            // I will update the backend to look for query param as well.
        } catch (error) {
            console.error("Error fetching data", error);
        }
        setLoading(false);
    };

    // Correct Implementation of fetchData using query params for now, I will fix backend to match.
    useEffect(() => {
        // fetchData(date);
        // Placeholder fetching logic
        const loadData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/diary/${date.toISOString()}`, {
                    method: 'POST', // TEMPORARY HACK: Use POST to send body if I can't change backend immediately, but backend expects GET.
                    // Wait, I can just use POST in backend if I change route.
                    // Let's just fix the backend `req.query` or `req.headers`.
                    headers: {
                        'Content-Type': 'application/json',
                        'x-user-id': mockUserId
                    },
                    body: JSON.stringify({ userId: mockUserId })
                });
                // Wait, GET with body will fail in browser.
                // I MUST fix the backend.
            } catch (e) { }
            setLoading(false);
        };
        // loadData();
    }, [date]);


    // TEMPORARY: I will write the component to fetch properly, assuming backend is fixed to take query param.
    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                // Assuming I'll fix backend to read query
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/diary/${date.toISOString()}?userId=${mockUserId}`);
                if (res.ok) {
                    const data = await res.json();
                    setDiaryEntry(data.diaryEntry?.content || "");
                    setTasks(data.tasks || []);
                }
            } catch (e) {
                console.error(e);
            }
            setLoading(false);
        };
        load();
    }, [date]);

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
                        <Timer userId={mockUserId} date={date} />
                    </div>
                </div>

                {/* Right Column: Diary & Tasks */}
                <div className="md:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[500px]">
                        <DiaryEditor date={date} initialContent={diaryEntry} userId={mockUserId} />
                        <TaskList date={date} initialTasks={tasks} userId={mockUserId} />
                    </div>
                </div>
            </div>
        </div>
    );
}
