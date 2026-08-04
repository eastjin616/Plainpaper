"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";
import { API_URL, extractDetail, getErrorMessage } from "@/lib/api";

const DEV_OPERATOR_BUTTON_ENABLED =
  process.env.NEXT_PUBLIC_DEV_OPERATOR_BUTTON_ENABLED === "true";
const DEV_OPERATOR_USERNAME = process.env.NEXT_PUBLIC_DEV_OPERATOR_USERNAME ?? "";
const DEV_OPERATOR_PASSWORD = process.env.NEXT_PUBLIC_DEV_OPERATOR_PASSWORD ?? "";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const { login } = useAuth();

  const loginWithCredentials = async (
    loginUsername: string,
    loginPassword: string,
  ) => {
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: loginUsername,
          password: loginPassword,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(extractDetail(data, "로그인에 실패했습니다."));
      }

      await login(data.access_token as string);
      router.push("/");
    } catch (err) {
      setError(getErrorMessage(err, "로그인에 실패했습니다."));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    await loginWithCredentials(username, password);
  };

  const handleOperatorLogin = async () => {
    if (!DEV_OPERATOR_USERNAME || !DEV_OPERATOR_PASSWORD) {
      setError("개발 운영자 계정 설정이 없습니다.");
      return;
    }
    await loginWithCredentials(DEV_OPERATOR_USERNAME, DEV_OPERATOR_PASSWORD);
  };

  return (
    <main className="relative flex items-center justify-center min-h-screen bg-background overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 left-[10%] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.2),_rgba(255,255,255,0))]" />
        <div className="absolute -bottom-40 right-[-8%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.22),_rgba(255,255,255,0))]" />
      </div>

      <Card className="relative w-full max-w-[420px] mx-4 p-6 sm:p-8 shadow-xl border border-border bg-card/80 backdrop-blur-xl">
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/로고.png"
              alt="Plainpaper 로고"
              className="h-16 w-auto mb-3 object-contain"
            />
            <h1 className="text-2xl font-bold text-foreground">Plainpaper</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">아이디</label>
              <Input
                className="bg-card/60"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">비밀번호</label>
              <Input
                className="bg-card/60"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <Button className="w-full text-lg font-medium" type="submit">
              {loading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            계정이 없으신가요?{" "}
            <Link href="/signup" className="font-semibold text-primary hover:underline">
              회원가입
            </Link>
          </p>
          <p className="text-center text-sm text-muted-foreground mt-2">
            <Link
              href="/forgot-password"
              className="font-semibold text-primary hover:underline"
            >
              비밀번호를 잊으셨나요?
            </Link>
          </p>

          {DEV_OPERATOR_BUTTON_ENABLED && (
            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={handleOperatorLogin}
              disabled={loading}
            >
              {loading ? "운영자 로그인 중..." : "운영자"}
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
