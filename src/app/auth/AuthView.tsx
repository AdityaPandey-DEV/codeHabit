"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import api from "@/lib/api";
import { Code2, BarChart2, BrainCircuit, ListTodo } from "lucide-react";

export default function AuthPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    // Login State
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Register State
    const [regUsername, setRegUsername] = useState("");
    const [regEmail, setRegEmail] = useState("");
    const [regPassword, setRegPassword] = useState("");
    const [regLeetCode, setRegLeetCode] = useState("");

    const onLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post("/auth/login", { email: loginEmail, password: loginPassword });
            localStorage.setItem("token", res.data.token);
            toast.success("Welcome back!");
            router.push("/");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Login failed");
        } finally {
            setIsLoading(false);
        }
    };

    const onRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await api.post("/auth/register", {
                username: regUsername,
                email: regEmail,
                password: regPassword,
                leetcodeUsername: regLeetCode,
            });
            localStorage.setItem("token", res.data.token);
            toast.success("Account created! Welcome.");
            router.push("/");
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full items-center justify-center bg-black/95 px-4">
            {/* Background grid pattern */}
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            
            {/* Floating gradient orbs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            
            <div className="z-10 w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-5xl font-bold tracking-tight text-white mb-2">
                        Dev<span className="bg-gradient-to-r from-violet-500 to-purple-500 bg-clip-text text-transparent">Track</span>
                    </h1>
                    <p className="text-zinc-400 text-lg">Your developer productivity command center</p>
                    
                    {/* Feature pills */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {[
                            { icon: ListTodo, label: "Habits", color: "text-violet-400" },
                            { icon: Code2, label: "LeetCode", color: "text-emerald-400" },
                            { icon: BrainCircuit, label: "Quizzes", color: "text-amber-400" },
                            { icon: BarChart2, label: "Analytics", color: "text-sky-400" },
                        ].map((f) => (
                            <span key={f.label} className="flex items-center gap-1 px-3 py-1 rounded-full bg-zinc-800/50 text-xs text-zinc-300 border border-zinc-700/50">
                                <f.icon className={`h-3 w-3 ${f.color}`} />
                                {f.label}
                            </span>
                        ))}
                    </div>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800 p-1">
                        <TabsTrigger value="login" className="data-[state=active]:bg-white data-[state=active]:text-black">Login</TabsTrigger>
                        <TabsTrigger value="register" className="data-[state=active]:bg-white data-[state=active]:text-black">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur text-white">
                            <CardHeader>
                                <CardTitle>Welcome Back</CardTitle>
                                <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                            </CardHeader>
                            <form onSubmit={onLogin}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="dev@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="bg-zinc-950/50 border-zinc-800 focus:ring-violet-500 focus:border-violet-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="bg-zinc-950/50 border-zinc-800 focus:ring-violet-500 focus:border-violet-500" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 transition-all" disabled={isLoading}>
                                        {isLoading ? "Signing in..." : "Sign In"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="register">
                        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur text-white">
                            <CardHeader>
                                <CardTitle>Create Account</CardTitle>
                                <CardDescription>Start tracking your developer journey today.</CardDescription>
                            </CardHeader>
                            <form onSubmit={onRegister}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-username">Username</Label>
                                        <Input id="reg-username" placeholder="johndoe" value={regUsername} onChange={(e) => setRegUsername(e.target.value)} required className="bg-zinc-950/50 border-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-email">Email</Label>
                                        <Input id="reg-email" type="email" placeholder="dev@example.com" value={regEmail} onChange={(e) => setRegEmail(e.target.value)} required className="bg-zinc-950/50 border-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-leetcode">LeetCode Username</Label>
                                        <Input id="reg-leetcode" placeholder="leetcode_user" value={regLeetCode} onChange={(e) => setRegLeetCode(e.target.value)} className="bg-zinc-950/50 border-zinc-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="reg-password">Password</Label>
                                        <Input id="reg-password" type="password" value={regPassword} onChange={(e) => setRegPassword(e.target.value)} required className="bg-zinc-950/50 border-zinc-800" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 transition-all" disabled={isLoading}>
                                        {isLoading ? "Creating account..." : "Create Account"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
