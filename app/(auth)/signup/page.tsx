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
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [serverCodeSent, setServerCodeSent] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");

  const sendCode = async () => {
    setError("");
    setMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error("인증코드를 전송할 수 없습니다.");
      setServerCodeSent(true);
      setMsg("📨 인증코드를 이메일로 보냈습니다.");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const verifyCode = async () => {
    setError(""); setMsg("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verification_code: verificationCode }),
      });

      if (!res.ok) throw new Error("인증코드가 올바르지 않습니다.");

      setEmailVerified(true);
      setMsg("✔ 인증 완료!");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMsg("");

    if (!emailVerified) return setError("이메일 인증을 완료해주세요.");
    if (password !== confirmPassword) return setError("비밀번호가 일치하지 않습니다.");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) throw new Error("회원가입 실패");

      router.push("/signup/success");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-[420px] mx-4 p-6 sm:p-8 shadow-xl border border-border bg-card/80 backdrop-blur-xl">
        <CardContent>
          <h1 className="text-3xl font-bold text-center mb-6 text-foreground">CareerPilot</h1>

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">이름</label>
              <Input className="bg-card/60" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">이메일</label>
              <div className="flex gap-2">
                <Input
                  className="bg-card/60"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button type="button" onClick={sendCode} disabled={!email}>
                  인증
                </Button>
              </div>

              {serverCodeSent && !emailVerified && (
                <div className="flex gap-2 mt-2">
                  <Input
                    className="bg-card/60"
                    placeholder="인증코드 입력"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                  <Button type="button" onClick={verifyCode}>
                    확인
                  </Button>
                </div>
              )}

              {emailVerified && (
                <p className="text-green-600 text-sm mt-1">✔ 이메일 인증 완료</p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">비밀번호</label>
              <Input
                className="bg-card/60"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">비밀번호 확인</label>
              <Input
                className="bg-card/60"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {msg && <p className="text-green-600 text-sm">{msg}</p>}

            <Button type="submit" disabled={!emailVerified} className="w-full text-lg">
              회원가입
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              로그인
            </Link>
          </p>
        </CardContent>
      </Card>
    </main>
  );
}
