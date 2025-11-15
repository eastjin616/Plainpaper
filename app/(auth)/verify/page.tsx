"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const code = searchParams.get("code");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!code) {
      setStatus("error");
      setMessage("잘못된 접근입니다. 인증 코드가 없습니다.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/verify-email?code=${code}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.detail || "이메일 인증에 실패했습니다.");
        }

        setStatus("success");
        setMessage(data.message || "이메일 인증이 완료되었습니다.");
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message ?? "이메일 인증 중 오류가 발생했습니다.");
      }
    };

    verify();
  }, [code]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100">
      <Card className="w-[420px] p-8 text-center shadow-xl border border-zinc-200 bg-white/80 backdrop-blur">
        <CardContent className="space-y-4">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">이메일 인증</h1>

          {status === "loading" && (
            <p className="text-zinc-600 text-sm">
              이메일 인증을 진행 중입니다...
            </p>
          )}

          {status !== "loading" && (
            <p
              className={
                status === "success" ? "text-green-600 text-sm" : "text-red-500 text-sm"
              }
            >
              {message}
            </p>
          )}

          {status !== "loading" && (
            <Button
              className="mt-4 w-full"
              onClick={() => router.push("/login")}
            >
              로그인 하러 가기
            </Button>
          )}
        </CardContent>
      </Card>
    </main>
  );
}