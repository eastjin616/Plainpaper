"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProtectedPage from "@/app/_contexts/ProtectedPage";
import { Sparkles, FileText } from "lucide-react";

export default function Home() {
  return (
    <ProtectedPage>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 via-zinc-100 to-zinc-200 px-4">
        <Card className="w-full max-w-lg p-8 text-center shadow-2xl border border-white/60 bg-white/80 backdrop-blur-xl">
          <CardContent className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-xs text-purple-700 border border-purple-100">
              <Sparkles className="w-3 h-3" />
              <span>Plainpaper · 문서 요약 AI</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-zinc-900">
              Plainpaper ✨
            </h1>

            <p className="text-zinc-600 text-sm md:text-base leading-relaxed">
              보험 약관, 대출 계약서, 이용 약관처럼
              <br />
              읽기 힘든 문서를 AI가{" "}
              <span className="font-semibold text-purple-600">
                몇 줄 요약으로
              </span>{" "}
              바꿔드립니다.
            </p>

            <div className="flex flex-col gap-2 text-xs text-zinc-500">
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4 text-zinc-400" />
                <span>PDF 한 번 업로드로 핵심만 빠르게 확인</span>
              </div>
            </div>

            <Button asChild className="w-full text-lg font-medium bg-purple-600 hover:bg-purple-700">
              <Link href="/upload">시작하기</Link>
            </Button>
          </CardContent>
        </Card>
        <div className="mt-12 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-white/70 shadow text-center border border-zinc-200">
            <h3 className="font-semibold text-zinc-800 text-lg mb-2">📄 문서 요약</h3>
            <p className="text-sm text-zinc-600">
              복잡한 약관도 몇 줄 요약으로 빠르게 확인할 수 있어요.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/70 shadow text-center border border-zinc-200">
            <h3 className="font-semibold text-zinc-800 text-lg mb-2">⚠️ 위험 조항 분석</h3>
            <p className="text-sm text-zinc-600">
              소비자에게 불리한 위험 문장을 자동으로 탐지합니다.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-white/70 shadow text-center border border-zinc-200">
            <h3 className="font-semibold text-zinc-800 text-lg mb-2">📊 금액·기간 자동 추출</h3>
            <p className="text-sm text-zinc-600">
              금액·환급률·납입 기간을 한눈에 보게 표로 정리해드립니다.
            </p>
          </div>
      </div>
      </main>
    </ProtectedPage>
  );
}