"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type ResetPasswordFormProps = {
  token: string | null;
};

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get("token");
  const effectiveToken = token ?? tokenFromQuery;

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!effectiveToken) {
      setError("재설정 토큰이 없습니다. 메일의 링크를 확인해주세요.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token: effectiveToken,
            new_password: newPassword,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.detail || "비밀번호 재설정에 실패했습니다.");
      }

      setSuccess(data.message || "비밀번호가 재설정되었습니다.");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => router.push("/login"), 1200);
    } catch (err: any) {
      setError(err.message ?? "요청 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-[420px] mx-4 p-6 sm:p-8 shadow-xl border border-border bg-card/80 backdrop-blur-xl">
        <CardContent>
          <h1 className="text-2xl font-bold text-center mb-4 text-foreground">
            비밀번호 재설정
          </h1>
          <p className="text-center text-sm text-muted-foreground mb-6">
            새 비밀번호를 입력해주세요.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">새 비밀번호</label>
              <Input
                className="bg-card/60"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground">새 비밀번호 확인</label>
              <Input
                className="bg-card/60"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-600 text-sm">{success}</p>}

            <Button className="w-full text-lg font-medium" type="submit">
              {loading ? "재설정 중..." : "비밀번호 재설정"}
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
