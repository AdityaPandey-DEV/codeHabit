"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, Pencil, Trash2, Flame, Calendar as CalendarIcon } from "lucide-react";
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
    targetFrequency: string;
    currentStreak: number;
    longestStreak: number;
    logs: any[];
}

const CATEGORY_COLORS: Record<string, string> = {
    HEALTH: "text-emerald-400 bg-emerald-400/10",
    STUDY: "text-sky-400 bg-sky-400/10",
    CODING: "text-violet-400 bg-violet-400/10",
    OTHER: "text-zinc-400 bg-zinc-400/10",
};

export default function HabitsPage() {
    const router = useRouter();
    const [habits, setHabits] = useState<Habit[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
    const [showCalendar, setShowCalendar] = useState<string | null>(null);

    // Form State
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

    const handleUpdate = async () => {
        if (!editingHabit) return;
        try {
            await api.put(`/habits/${editingHabit.id}`, { name, category });
            toast.success("Habit updated!");
            setEditingHabit(null);
            setName("");
            fetchHabits();
        } catch (error) {
            toast.error("Failed to update habit");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this habit?")) return;
        try {
            await api.delete(`/habits/${id}`);
            toast.success("Habit deleted");
            fetchHabits();
        } catch (error) {
            toast.error("Failed to delete habit");
        }
    };

    const toggleHabit = async (id: string, isCompleted: boolean) => {
        try {
            const today = new Date().toISOString().split('T')[0];
            await api.post(`/habits/${id}/log`, {
                date: today,
                status: isCompleted ? "COMPLETED" : "SKIPPED"
            });
            fetchHabits();
            toast.success(isCompleted ? "Great job! 🎉" : "Habit unchecked");
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const openEdit = (habit: Habit) => {
        setEditingHabit(habit);
        setName(habit.name);
        setCategory(habit.category);
    };

    // Generate calendar grid for last 90 days
    const renderCalendar = (habit: Habit) => {
        const completedDates = new Set(
            habit.logs
                .filter((l: any) => l.status === 'COMPLETED')
                .map((l: any) => new Date(l.date).toISOString().split('T')[0])
        );

        const days = [];
        for (let i = 89; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().split('T')[0];
            const isCompleted = completedDates.has(dateStr);
            days.push(
                <div
                    key={dateStr}
                    className={`w-3 h-3 rounded-sm transition-all ${
                        isCompleted ? 'bg-violet-500' : 'bg-zinc-800'
                    }`}
                    title={`${dateStr}: ${isCompleted ? 'Completed' : 'Missed'}`}
                />
            );
        }
        return days;
    };

    // Calculate stats
    const totalHabits = habits.length;
    const completedToday = habits.filter(h => h.logs?.length > 0 && h.logs.some((l: any) => l.status === 'COMPLETED')).length;
    const bestStreak = Math.max(...habits.map(h => h.longestStreak || 0), 0);

    return (
        <div className="p-6 md:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                        Habit Tracker
                    </h2>
                    <p className="text-zinc-400 mt-1">Build consistency, one day at a time.</p>
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
                                        <SelectItem value="HEALTH">🏃 Health</SelectItem>
                                        <SelectItem value="STUDY">📚 Study</SelectItem>
                                        <SelectItem value="CODING">💻 Coding</SelectItem>
                                        <SelectItem value="OTHER">📋 Other</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreate} className="bg-violet-600 hover:bg-violet-700">Save Habit</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Stats bar */}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                <Card className="bg-zinc-900/80 border-zinc-800 text-white">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-violet-500/10">
                            <Check className="h-5 w-5 text-violet-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{completedToday}/{totalHabits}</p>
                            <p className="text-xs text-zinc-400">Completed today</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/80 border-zinc-800 text-white">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-orange-500/10">
                            <Flame className="h-5 w-5 text-orange-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{bestStreak}</p>
                            <p className="text-xs text-zinc-400">Best streak (days)</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-zinc-900/80 border-zinc-800 text-white">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-emerald-500/10">
                            <CalendarIcon className="h-5 w-5 text-emerald-400" />
                        </div>
                        <div>
                            <p className="text-2xl font-bold">{totalHabits}</p>
                            <p className="text-xs text-zinc-400">Active habits</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Habits List */}
            <div className="grid gap-4">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-3 border-violet-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : habits.map((habit) => {
                    const isCompletedToday = habit.logs && habit.logs.length > 0 && habit.logs.some((l: any) => l.status === 'COMPLETED');
                    return (
                        <Card key={habit.id} className={`bg-zinc-900/80 border-zinc-800 text-white transition-all duration-300 ${isCompletedToday ? 'border-violet-500/40 bg-violet-950/10' : 'hover:border-zinc-700'}`}>
                            <div className="p-5">
                                <div className="flex items-center gap-4">
                                    <Checkbox
                                        id={habit.id}
                                        checked={isCompletedToday}
                                        onCheckedChange={(checked) => toggleHabit(habit.id, checked as boolean)}
                                        className="w-6 h-6 border-zinc-600 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`font-semibold text-lg truncate ${isCompletedToday ? 'text-zinc-500 line-through' : ''}`}>
                                                {habit.name}
                                            </h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${CATEGORY_COLORS[habit.category] || CATEGORY_COLORS.OTHER}`}>
                                                {habit.category.toLowerCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-1">
                                            <span className="text-xs text-zinc-400 flex items-center gap-1">
                                                <Flame className="h-3 w-3 text-orange-400" />
                                                {habit.currentStreak}d streak
                                            </span>
                                            <span className="text-xs text-zinc-500">
                                                Best: {habit.longestStreak}d
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                            onClick={() => setShowCalendar(showCalendar === habit.id ? null : habit.id)}
                                        >
                                            <CalendarIcon className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-zinc-800"
                                            onClick={() => openEdit(habit)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-zinc-400 hover:text-red-400 hover:bg-red-500/10"
                                            onClick={() => handleDelete(habit.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>

                                {/* Calendar heatmap view */}
                                {showCalendar === habit.id && (
                                    <div className="mt-4 pt-4 border-t border-zinc-800">
                                        <p className="text-xs text-zinc-400 mb-2">Last 90 days</p>
                                        <div className="flex flex-wrap gap-1">
                                            {renderCalendar(habit)}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    );
                })}
                {!loading && habits.length === 0 && (
                    <div className="text-center py-16 text-zinc-500">
                        <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                            <Plus className="h-8 w-8 text-zinc-600" />
                        </div>
                        <p className="text-lg font-medium">No habits yet</p>
                        <p className="text-sm mt-1">Create one to start building consistency!</p>
                    </div>
                )}
            </div>

            {/* Edit Dialog */}
            <Dialog open={!!editingHabit} onOpenChange={(open) => { if (!open) setEditingHabit(null); }}>
                <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Edit Habit</DialogTitle>
                        <DialogDescription>Update your habit details</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Habit Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} className="bg-zinc-950 border-zinc-800" />
                        </div>
                        <div className="space-y-2">
                            <Label>Category</Label>
                            <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger className="bg-zinc-950 border-zinc-800">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                                    <SelectItem value="HEALTH">🏃 Health</SelectItem>
                                    <SelectItem value="STUDY">📚 Study</SelectItem>
                                    <SelectItem value="CODING">💻 Coding</SelectItem>
                                    <SelectItem value="OTHER">📋 Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEditingHabit(null)} className="border-zinc-700 text-white hover:bg-zinc-800">Cancel</Button>
                        <Button onClick={handleUpdate} className="bg-violet-600 hover:bg-violet-700">Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
