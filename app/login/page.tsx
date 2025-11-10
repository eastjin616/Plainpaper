"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("로그인 실패");
      const data = await res.json();
      console.log("✅ 로그인 성공:", data);
      // 로그인 성공 시 토큰 저장 or 라우팅
      // localStorage.setItem("token", data.access_token);
      // router.push("/upload");
    } catch (err: any) {
      setError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
      <Card className="w-[420px] p-8 text-center shadow-xl border border-zinc-200 bg-white/80 backdrop-blur">
        <CardContent>
          <h1 className="text-3xl font-bold text-zinc-900 mb-6">Plainpaper</h1>

          <form onSubmit={handleLogin} className="flex flex-col space-y-4 text-left">
            <div>
              <label className="text-sm text-zinc-600 font-medium">이메일</label>
              <Input
                type="email"
                placeholder="이메일을 입력하세요"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-zinc-600 font-medium">비밀번호</label>
              <Input
                type="password"
                placeholder="비밀번호를 입력하세요"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <Button
              type="submit"
              className="w-full text-lg font-medium"
              disabled={loading}
            >
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-zinc-600">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="font-semibold text-zinc-900 hover:underline">
              회원가입
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}