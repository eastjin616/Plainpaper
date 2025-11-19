"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function AnalysisLoadingPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id;


  const [status, setStatus] = useState("pending");

  // 🔥 주기적으로 상태 확인
  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/analysis/status/${documentId}`,
        { cache: "no-store" }
      );

      const data = await res.json();

      setStatus(data.status);

      if (data.status === "done") {
        clearInterval(interval);
        router.push(`${process.env.NEXT_PUBLIC_API_URL}/analysis/${documentId}`);
      }
    }, 2000); // 2초마다 polling

    return () => clearInterval(interval);
  }, [documentId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50">
      <Loader2 className="h-12 w-12 text-blue-500 animate-spin" />

      <h2 className="text-xl font-semibold mt-4">문서를 분석하고 있습니다…</h2>
      <p className="text-zinc-500 mt-2">
        조금만 기다려주세요. AI가 약관을 읽고 내용을 정리하는 중입니다.
      </p>

      <p className="text-sm text-zinc-400 mt-6">
        현재 상태: <span className="font-medium">{status}</span>
      </p>
    </div>
  );
}