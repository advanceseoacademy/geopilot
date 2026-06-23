"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await authClient.signIn.email({ email, password });

    setLoading(false);

    if (authError) {
      setError(authError.message || "Failed to log in");
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <Card className="w-full max-w-md bg-zinc-900/50 border-zinc-800">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold tracking-tight">Welcome back</CardTitle>
        <CardDescription>Enter your email and password to log in</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="bg-zinc-950 border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="bg-zinc-950 border-zinc-800"
            />
          </div>
          {error && (
            <div className="text-sm text-red-500 font-medium bg-red-500/10 p-3 rounded-md border border-red-500/20">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={loading}>
            {loading ? "Logging in..." : "Log in"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 text-center">
        <div className="text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-purple-400 hover:text-purple-300 font-semibold transition-colors">
            Sign up
          </Link>
        </div>
        <div className="text-xs text-zinc-500">
          <Link href="/" className="hover:text-zinc-300 transition-colors">
            ← Back to home
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
