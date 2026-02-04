"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

interface DiaryEditorProps {
    date: Date;
    initialContent: string;
    userId: string;
}

export default function DiaryEditor({ date, initialContent, userId }: DiaryEditorProps) {
    const [content, setContent] = useState(initialContent);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setContent(initialContent);
    }, [initialContent]);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/diary/entry`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId, // In a real app, this should come from auth context/token
                    date: date.toISOString(),
                    content,
                }),
            });

            if (!response.ok) {
                throw new Error("Failed to save diary entry");
            }

            toast.success("Diary entry saved!");
        } catch (error) {
            console.error(error);
            toast.error("Failed to save diary entry");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">Daily Reflection & Faults</CardTitle>
                <Button onClick={handleSave} disabled={isSaving} size="sm">
                    {isSaving ? "Saving..." : "Save"}
                </Button>
            </CardHeader>
            <CardContent className="flex-1 min-h-[300px]">
                <textarea
                    className="w-full h-full p-4 resize-none bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="Write about your day, your faults, and what you want to improve..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                />
            </CardContent>
        </Card>
    );
}
