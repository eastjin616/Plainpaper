"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

export default function SignupSuccessPage() {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background relative overflow-hidden">
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}
        numberOfPieces={160}
        gravity={0.25}
      />

      <Card className="w-full max-w-[400px] mx-4 p-6 sm:p-8 text-center shadow-xl border border-border bg-card/80 backdrop-blur-xl relative z-10">
        <CardContent>
          <h1 className="text-3xl font-bold text-foreground mb-2">🎉 가입 완료!</h1>
          <p className="text-muted-foreground mb-1">회원가입이 성공적으로 완료되었습니다.</p>
          <p className="text-muted-foreground mb-6">지금 바로 CareerPilot를 시작해보세요!</p>

          <Button
            onClick={() => router.push("/login")}
            className="w-full text-lg font-medium"
          >
            로그인 하러 가기
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
