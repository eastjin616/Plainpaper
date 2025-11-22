"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    console.log("🚀 API URL:", process.env.NEXT_PUBLIC_API_URL);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "로그인 실패");

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      login(data.access_token);

      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
      <Card className="w-[420px] p-8 shadow-xl border border-white/50 bg-white/80 backdrop-blur-xl">
        <CardContent>
          <h1 className="text-3xl font-bold text-center mb-6 text-zinc-900">Plainpaper</h1>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-zinc-600">이메일</label>
              <Input
                className="bg-white/80"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-zinc-600">비밀번호</label>
              <Input
                className="bg-white/80"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button className="w-full text-lg font-medium bg-purple-600 hover:bg-purple-700" type="submit">
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <p className="text-center text-sm text-zinc-600 mt-6">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="font-semibold text-purple-700 hover:underline">
              회원가입
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}