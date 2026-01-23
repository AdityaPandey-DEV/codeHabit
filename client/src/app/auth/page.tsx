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
        <div className="flex h-screen w-full items-center justify-center bg-black/95 px-4 backdrop-blur-sm">
            <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
            <div className="z-10 w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Code<span className="text-violet-500">Habit</span></h1>
                    <p className="text-zinc-400">Master your craft with data-driven insights.</p>
                </div>

                <Tabs defaultValue="login" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-zinc-900 border border-zinc-800">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="register">Register</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur text-white">
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
                            </CardHeader>
                            <form onSubmit={onLogin}>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="dev@example.com" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} required className="bg-zinc-950/50 border-zinc-800 focus:ring-violet-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="password">Password</Label>
                                        <Input id="password" type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} required className="bg-zinc-950/50 border-zinc-800 focus:ring-violet-500" />
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={isLoading}>
                                        {isLoading ? "Loading..." : "Sign In"}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Card>
                    </TabsContent>

                    <TabsContent value="register">
                        <Card className="bg-zinc-900/50 border-zinc-800 backdrop-blur text-white">
                            <CardHeader>
                                <CardTitle>Create Account</CardTitle>
                                <CardDescription>Start tracking your journey today.</CardDescription>
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
                                    <Button type="submit" className="w-full bg-violet-600 hover:bg-violet-700" disabled={isLoading}>
                                        {isLoading ? "Creating..." : "Create Account"}
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
