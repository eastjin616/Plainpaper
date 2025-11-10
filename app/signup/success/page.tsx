"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Confetti from "react-confetti";

export default function SignupSuccessPage() {
  const router = useRouter();
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  // 화면 크기 감지 (SSR에서 window 없음 방지)
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    }
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 relative overflow-hidden">
      {/* 🎉 폭죽 효과 */}
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={false}        // 한 번만 터지게
        numberOfPieces={180}   // 폭죽 개수
        gravity={0.25}         // 낙하 속도
      />

      <Card className="w-[400px] p-8 text-center shadow-xl border border-zinc-200 bg-white/80 backdrop-blur relative z-10">
        <CardContent>
          <h1 className="text-3xl font-bold text-zinc-900 mb-2">🎉Plainpaper✨</h1>
          <p className="text-zinc-600 mb-1">회원가입이 완료되었습니다!</p>
          <p className="text-zinc-500 mb-6">복잡한 문서를 쉽게 이해해볼까요?</p>

          <Button
            onClick={() => router.push("/login")}
            className="w-full text-lg font-medium"
          >
            시작하기
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}