"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, Square, Save } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/api";

interface TimerProps {
    date: Date;
}

export default function Timer({ date }: TimerProps) {
    const [seconds, setSeconds] = useState(0);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isActive) {
            interval = setInterval(() => {
                setSeconds(seconds => seconds + 1);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isActive]);

    const toggleTimer = () => {
        setIsActive(!isActive);
    };

    const resetTimer = () => {
        setIsActive(false);
        setSeconds(0);
    };

    const saveSession = async () => {
        if (seconds === 0) return;

        // Convert to minutes, rounding up
        const minutes = Math.ceil(seconds / 60);

        try {
            await api.post('/diary/timer', {
                date: date.toISOString(),
                minutes,
            });

            toast.success(`Saved ${minutes} minutes of study time!`);
            resetTimer();
        } catch (error) {
            console.error(error);
            toast.error("Failed to save session");
        }
    };

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-xl font-bold">Focus Timer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-6">
                <div className="text-5xl font-mono font-bold tracking-widest">
                    {formatTime(seconds)}
                </div>

                <div className="flex gap-4">
                    <Button
                        onClick={toggleTimer}
                        variant={isActive ? "secondary" : "default"}
                        size="lg"
                        className="w-32"
                    >
                        {isActive ? (
                            <><Pause className="mr-2 h-4 w-4" /> Pause</>
                        ) : (
                            <><Play className="mr-2 h-4 w-4" /> Start</>
                        )}
                    </Button>

                    <Button
                        onClick={resetTimer}
                        variant="destructive"
                        size="icon"
                        disabled={seconds === 0}
                    >
                        <Square className="h-4 w-4" />
                    </Button>

                    <Button
                        onClick={saveSession}
                        variant="outline"
                        size="icon"
                        disabled={seconds === 0 || isActive}
                        title="Save Session"
                    >
                        <Save className="h-4 w-4" />
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground text-center">
                    {isActive ? "Focus mode is on. Keep going!" : "Ready to start a session?"}
                </p>
            </CardContent>
        </Card>
    );
}
