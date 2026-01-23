"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import api from "@/lib/api";
import { toast } from "sonner";

interface Habit {
    id: string;
    name: string;
    description: string;
    category: string;
    frequency: string;
    logs: any[]; // We only need to check if length > 0 for today
}

export default function HabitsPage() {
    const router = useRouter();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);

    // New Habit Form
    const [name, setName] = useState("");
    const [category, setCategory] = useState("STUDY");

    const fetchHabits = async () => {
        try {
            const res = await api.get("/habits");
            setHabits(res.data.data.habits);
        } catch (error) {
            toast.error("Failed to fetch habits");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabits();
    }, []);

    const handleCreate = async () => {
        try {
            await api.post("/habits", { name, category });
            toast.success("Habit created!");
            setOpen(false);
            setName("");
            fetchHabits();
        } catch (error) {
            toast.error("Failed to create habit");
        }
    };

    const toggleHabit = async (id: string, isCompleted: boolean) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            await api.post(`/habits/${id}/log`, {
                date: today,
                status: isCompleted ? "COMPLETED" : "SKIPPED"
            });

            // Optimistic update or refetch
            fetchHabits();
            toast.success(isCompleted ? "Great job!" : "Habit unchecked");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Habit Tracker</h2>
                    <p className="text-zinc-400">Build consistency, one day at a time.</p>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-violet-600 hover:bg-violet-700">
                            <Plus className="mr-2 h-4 w-4" /> New Habit
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                        <DialogHeader>
                            <DialogTitle>Create New Habit</DialogTitle>
                            <DialogDescription>What do you want to achieve?</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Habit Name</Label>
                                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Read 30 mins" className="bg-zinc-950 border-zinc-800" />
                            </div>
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                        <SelectItem value="HEALTH">Health</SelectItem>
                                        <SelectItem value="STUDY">Study</SelectItem>
                                        <SelectItem value="CODING">Coding</SelectItem>
                                        <SelectItem value="OTHER">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} className="bg-violet-600">Save Habit</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {loading ? <p>Loading habits...</p> : habits.map((habit) => {
                    const isCompletedToday = habit.logs && habit.logs.length > 0 && habit.logs[0].status === 'COMPLETED';
                    return (
                        <Card key={habit.id} className={`bg-zinc-900 border-zinc-800 text-white transition-all ${isCompletedToday ? 'border-violet-500/50 bg-violet-950/10' : ''}`}>
                            <div className="flex items-center p-6">
                                <Checkbox
                                    id={habit.id}
                                    checked={isCompletedToday}
                                    onCheckedChange={(checked) => toggleHabit(habit.id, checked as boolean)}
                                    className="w-6 h-6 mr-4 border-zinc-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                                />
                                <div className="flex-1">
                                    <h3 className={`font-semibold text-lg ${isCompletedToday ? 'text-zinc-500 line-through' : ''}`}>{habit.name}</h3>
                                    <p className="text-sm text-zinc-400 capitalize">{habit.category.toLowerCase()}</p>
                                </div>
                            </div>
                        </Card>
                    );
                })}
                {!loading && habits.length === 0 && (
                    <div className="text-center py-12 text-zinc-500">
                        <p>No habits yet. Create one to get started!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
