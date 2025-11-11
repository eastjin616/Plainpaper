"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || "회원가입 실패");
      }

      router.push("/signup/success")
      setTimeout(() => router.push("/login"), 1500);
    } catch (err: any) {
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100">
      <Card className="w-[420px] p-8 text-center shadow-xl border border-zinc-200 bg-white/80 backdrop-blur">
        <CardContent>
          <h1 className="text-3xl font-bold text-zinc-900 mb-6">Plainpaper</h1>

          <form onSubmit={handleSignup} className="flex flex-col space-y-4 text-left">
            <div>
              <label className="text-sm text-zinc-600 font-medium">이름</label>
              <Input
                placeholder="이름을 입력하세요"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

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

            <div>
              <label className="text-sm text-zinc-600 font-medium">비밀번호 확인</label>
              <Input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            {message && <p className="text-green-600 text-sm text-center">{message}</p>}

            <Button
              type="submit"
              className="w-full text-lg font-medium"
              disabled={loading}
            >
              {loading ? "처리 중..." : "회원가입"}
            </Button>
          </form>

          <div className="mt-6 text-sm text-zinc-600 text-center">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="font-semibold text-zinc-900 hover:underline">
              로그인
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}