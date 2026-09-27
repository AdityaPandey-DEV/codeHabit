"use client";

import Link from "next/link";
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
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regLeetCode, setRegLeetCode] = useState("");

  const onLogin = async (event: React.FormEvent) => { event.preventDefault(); setIsLoading(true); try { const res = await api.post("/auth/login", { email: loginEmail, password: loginPassword }); localStorage.setItem("token", res.data.token); router.push("/"); } catch (error: any) { toast.error(error.response?.data?.message || "Login failed"); } finally { setIsLoading(false); } };
  const onRegister = async (event: React.FormEvent) => { event.preventDefault(); setIsLoading(true); try { const res = await api.post("/auth/register", { username: regUsername, email: regEmail, password: regPassword, leetcodeUsername: regLeetCode }); localStorage.setItem("token", res.data.token); router.push("/"); } catch (error: any) { toast.error(error.response?.data?.message || "Registration failed"); } finally { setIsLoading(false); } };
  const fieldClass = "border-[#cdd7da] bg-white focus-visible:ring-[#0f766e]";

  return <main className="flex min-h-screen items-center justify-center bg-[#f7f8fa] px-4 py-10 text-[#15212b]"><div className="w-full max-w-md space-y-7">
    <div className="text-center"><h1 className="text-3xl font-semibold tracking-tight">Code<span className="text-[#0f766e]">Habit</span></h1><p className="mt-2 text-[#617079]">A private workspace for habits, focused study, and coding practice.</p></div>
    <Tabs defaultValue="login"><TabsList className="grid h-10 w-full grid-cols-2 rounded-md border border-[#dbe2e5] bg-[#eef3f2] p-1"><TabsTrigger value="login">Sign in</TabsTrigger><TabsTrigger value="register">Create account</TabsTrigger></TabsList>
      <TabsContent value="login"><Card className="border-[#dbe2e5] bg-white text-[#15212b] shadow-sm"><CardHeader><CardTitle>Welcome back</CardTitle><CardDescription>Use your account details to continue.</CardDescription></CardHeader><form onSubmit={onLogin}><CardContent className="space-y-4"><div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" placeholder="you@example.com" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required className={fieldClass} /></div><div className="space-y-2"><Label htmlFor="password">Password</Label><Input id="password" type="password" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required className={fieldClass} /></div></CardContent><CardFooter><Button type="submit" disabled={isLoading} className="w-full bg-[#0f766e] text-white hover:bg-[#0b5f58]">{isLoading ? "Signing in..." : "Sign in"}</Button></CardFooter></form></Card></TabsContent>
      <TabsContent value="register"><Card className="border-[#dbe2e5] bg-white text-[#15212b] shadow-sm"><CardHeader><CardTitle>Create your workspace</CardTitle><CardDescription>You can add your LeetCode username now or later.</CardDescription></CardHeader><form onSubmit={onRegister}><CardContent className="space-y-4"><div className="space-y-2"><Label htmlFor="username">Username</Label><Input id="username" value={regUsername} onChange={e => setRegUsername(e.target.value)} required className={fieldClass} /></div><div className="space-y-2"><Label htmlFor="register-email">Email</Label><Input id="register-email" type="email" placeholder="you@example.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} required className={fieldClass} /></div><div className="space-y-2"><Label htmlFor="leetcode">LeetCode username <span className="text-[#617079]">(optional)</span></Label><Input id="leetcode" value={regLeetCode} onChange={e => setRegLeetCode(e.target.value)} className={fieldClass} /></div><div className="space-y-2"><Label htmlFor="register-password">Password</Label><Input id="register-password" type="password" value={regPassword} onChange={e => setRegPassword(e.target.value)} required className={fieldClass} /></div></CardContent><CardFooter><Button type="submit" disabled={isLoading} className="w-full bg-[#0f766e] text-white hover:bg-[#0b5f58]">{isLoading ? "Creating account..." : "Create account"}</Button></CardFooter></form></Card></TabsContent>
    </Tabs><p className="text-center text-xs text-[#617079]">By continuing, you agree to the <Link href="/terms" className="underline hover:text-[#0f766e]">Terms &amp; Conditions</Link> and <Link href="/privacy" className="underline hover:text-[#0f766e]">Privacy Policy</Link>.</p>
  </div></main>;
}
