"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AnalysisLoadingPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [status, setStatus] = useState({
    status: "pending",
    progress: 0,
  });

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analysis/status/${documentId}`,
        { cache: "no-store" }
      );

      const data = await res.json();
      setStatus({ status: data.status, progress: data.progress });

      if (data.status === "done") {
        clearInterval(interval);
        router.push(`/analysis/${documentId}`);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [documentId, router]);

  const progressLabel =
    status.progress < 20
      ? "문서를 불러오는 중…"
      : status.progress < 50
        ? "AI가 내용을 분석하고 있어요…"
        : status.progress < 80
          ? "중요한 내용을 추출하는 중…"
          : status.progress < 100
            ? "거의 다 왔어요!"
            : "완료! 페이지로 이동 중…";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background px-6">

      {/* 🔥 네온 글로우 로더 */}
      <div className="relative mb-10">
        <div className="w-24 h-24 border-4 border-transparent border-t-primary border-r-primary/80 rounded-full animate-spin"></div>

        <div className="absolute inset-0 rounded-full blur-xl opacity-30 bg-primary"></div>
      </div>

      {/* 🔥 진행률 카드 */}
      <div className="backdrop-blur-md bg-card/50 rounded-xl shadow-xl border border-border px-8 py-6 w-[380px] animate-[pulse_3s_ease-in-out_infinite]">

        <h2 className="text-xl font-semibold text-foreground text-center mb-2">
          문서를 분석하고 있습니다…
        </h2>

        <p className="text-sm text-center text-muted-foreground mb-6">
          {progressLabel}
        </p>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-3 rounded-full bg-primary transition-all duration-500 ease-out shadow-lg"
            style={{ width: `${status.progress}%` }}
          />
        </div>

        {/* 숫자 퍼센트 */}
        <p className="text-center text-sm mt-3 font-medium text-primary">
          {status.progress}% 완료
        </p>
      </div>

      {/* 현재 상태 */}
      <p className="text-xs text-muted-foreground mt-6">
        상태: {status.status}
      </p>
    </div>
  );
}