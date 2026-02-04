"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Task {
    id: string;
    content: string;
    completed: boolean;
}

interface TaskListProps {
    date: Date;
    initialTasks: Task[];
    userId: string;
}

export default function TaskList({ date, initialTasks, userId }: TaskListProps) {
    const [tasks, setTasks] = useState<Task[]>(initialTasks);
    const [newTaskContent, setNewTaskContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setTasks(initialTasks);
    }, [initialTasks]);

    const handleAddTask = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTaskContent.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/diary/task`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    date: date.toISOString(),
                    content: newTaskContent,
                }),
            });

            if (!response.ok) throw new Error("Failed to add task");

            const newTask = await response.json();
            setTasks([...tasks, newTask]);
            setNewTaskContent("");
            toast.success("Task added");
        } catch (error) {
            console.error(error);
            toast.error("Failed to add task");
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleTask = async (id: string, completed: boolean) => {
        // Optimistic update
        setTasks(tasks.map(t => t.id === id ? { ...t, completed } : t));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/diary/task/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, completed }),
            });

            if (!response.ok) throw new Error("Failed to update task");
        } catch (error) {
            console.error(error);
            toast.error("Failed to update task");
            // Revert optimistic update
            setTasks(tasks.map(t => t.id === id ? { ...t, completed: !completed } : t));
        }
    };

    const handleDeleteTask = async (id: string) => {
        const originalTasks = [...tasks];
        setTasks(tasks.filter(t => t.id !== id));

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/diary/task/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }, // Should pass userId in body or header if strictly required by backend logic but DELETE usually doesn't have body in some specs. Backend expects body.userId.
                body: JSON.stringify({ userId }),
            });

            if (!response.ok) throw new Error("Failed to delete task");
        } catch (error) {
            console.error(error);
            toast.error("Failed to delete task");
            setTasks(originalTasks);
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Tasks & Todo</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <form onSubmit={handleAddTask} className="flex gap-2">
                    <Input
                        placeholder="Add a new task..."
                        value={newTaskContent}
                        onChange={(e) => setNewTaskContent(e.target.value)}
                        disabled={isLoading}
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </form>

                <div className="flex-1 overflow-y-auto space-y-2">
                    {tasks.length === 0 && (
                        <p className="text-muted-foreground text-sm text-center py-4">No tasks for this day.</p>
                    )}
                    {tasks.map((task) => (
                        <div key={task.id} className="flex items-center justify-between p-2 border rounded-md group">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={task.completed}
                                    onCheckedChange={(checked) => handleToggleTask(task.id, checked as boolean)}
                                />
                                <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                                    {task.content}
                                </span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-destructive hover:text-destructive"
                                onClick={() => handleDeleteTask(task.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
