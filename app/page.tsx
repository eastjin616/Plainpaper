"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import ProtectedPage from "@/app/_contexts/ProtectedPage";
import { Sparkles, FileText } from "lucide-react";
import { FeatureSection } from "@/components/home/FeatureSection";

import { ModeToggle } from "@/components/ui/mode-toggle";

export default function Home() {
  return (
    <ProtectedPage>
      <main className="flex flex-col items-center justify-center min-h-screen bg-background px-4 relative">
        <div className="absolute top-4 right-4">
          <ModeToggle />
        </div>
        <Card className="w-full max-w-lg p-8 text-center shadow-2xl border-border bg-card/80 backdrop-blur-xl">
          <CardContent className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-xs text-primary border border-primary/20">
              <Sparkles className="w-3 h-3" />
              <span>Plainpaper · 문서 요약 AI</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Plainpaper ✨
            </h1>

            <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
              보험 약관, 대출 계약서, 이용 약관처럼
              <br />
              읽기 힘든 문서를 AI가{" "}
              <span className="font-semibold text-primary">
                몇 줄 요약으로
              </span>{" "}
              바꿔드립니다.
            </p>

            <div className="flex flex-col gap-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground/80" />
                <span>PDF 한 번 업로드로 핵심만 빠르게 확인</span>
              </div>
            </div>

            <Button asChild className="w-full text-lg font-medium">
              <Link href="/upload">시작하기</Link>
            </Button>
          </CardContent>
        </Card>

        <FeatureSection />
      </main>
    </ProtectedPage>
  );
}