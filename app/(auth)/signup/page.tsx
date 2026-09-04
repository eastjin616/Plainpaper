"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL, extractDetail, getErrorMessage } from "@/lib/api";

const EMAIL_VERIFICATION_ENABLED =
  (process.env.NEXT_PUBLIC_EMAIL_VERIFICATION_ENABLED ?? "true").toLowerCase() !==
  "false";
const PASSWORD_MIN_LENGTH =
  Number(process.env.NEXT_PUBLIC_PASSWORD_MIN_LENGTH ?? "8") || 8;

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [serverCodeSent, setServerCodeSent] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    setError("");
    setMsg("");

    try {
      const res = await fetch(`${API_URL}/auth/send-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(extractDetail(data, "인증코드를 전송할 수 없습니다."));
      }
      setServerCodeSent(true);
      setMsg("📨 인증코드를 이메일로 보냈습니다.");
    } catch (err) {
      setError(getErrorMessage(err, "인증코드를 전송할 수 없습니다."));
    }
  };

  const verifyCode = async () => {
    setError("");
    setMsg("");

    try {
      const res = await fetch(`${API_URL}/auth/verify-code`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, verification_code: verificationCode }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(extractDetail(data, "인증코드가 올바르지 않습니다."));
      }

      setEmailVerified(true);
      setMsg("✔ 인증 완료!");
    } catch (err) {
      setError(getErrorMessage(err, "인증코드가 올바르지 않습니다."));
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      return setError("비밀번호가 일치하지 않습니다.");
    }
    if (EMAIL_VERIFICATION_ENABLED && !emailVerified) {
      return setError("이메일 인증을 완료해주세요.");
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, email, password }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(extractDetail(data, "회원가입 실패"));
      }

      router.push("/signup/success");
    } catch (err) {
      setError(getErrorMessage(err, "회원가입 실패"));
    } finally {
      setLoading(false);
    }
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

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground">이름</label>
              <Input
                className="bg-card/60"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">아이디</label>
              <Input
                className="bg-card/60"
                type="text"
                autoComplete="username"
                placeholder="영문·숫자·_·- (4~20자)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-sm text-muted-foreground">이메일</label>
              <Input
                className="bg-card/60"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {EMAIL_VERIFICATION_ENABLED ? (
                <>
                  <div className="flex gap-2 mt-2">
                    <Button type="button" onClick={sendCode} disabled={!email}>
                      인증코드 전송
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
                </>
              ) : (
                <p className="text-muted-foreground text-xs mt-1">
                  개발 모드에서는 이메일 인증을 건너뜁니다.
                </p>
              )}
            </div>

            <div>
              <label className="text-sm text-muted-foreground">비밀번호</label>
              <Input
                className="bg-card/60"
                type="password"
                autoComplete="new-password"
                minLength={PASSWORD_MIN_LENGTH}
                placeholder={`${PASSWORD_MIN_LENGTH}자 이상`}
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
                autoComplete="new-password"
                minLength={PASSWORD_MIN_LENGTH}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {msg && <p className="text-green-600 text-sm">{msg}</p>}

            <Button
              type="submit"
              disabled={loading || (EMAIL_VERIFICATION_ENABLED && !emailVerified)}
              className="w-full text-lg"
            >
              {loading ? "가입 중..." : "회원가입"}
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
