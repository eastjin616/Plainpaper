"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/password-reset`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "비밀번호 재설정 메일 전송에 실패했습니다.");
      }

      setSuccess(data.message || "비밀번호 재설정 메일을 보냈습니다.");
    } catch (err: any) {
      setError(err.message ?? "요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[420px] p-8 shadow-xl border border-border bg-card/80 backdrop-blur-xl">
        <CardContent>
          <h1 className="text-2xl font-bold text-center mb-4 text-foreground">
            비밀번호 찾기
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-6">
            가입한 이메일로 비밀번호 재설정 링크를 보내드립니다.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">이메일</label>
              <Input
                className="bg-card/60"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <Button className="w-full text-lg font-medium" type="submit">
              {loading ? "전송 중..." : "재설정 메일 보내기"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link href="/login" className="font-semibold text-primary hover:underline">
              로그인으로 돌아가기
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
