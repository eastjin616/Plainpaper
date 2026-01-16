"use client";

import ProtectedPage from "@/app/_contexts/ProtectedPage";
import { Card, CardContent } from "@/components/ui/card";

export default function KnowledgeWikiPage() {
  return (
    <ProtectedPage>
      <main className="relative min-h-screen bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-24 right-[8%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,116,144,0.2),_rgba(255,255,255,0))]" />
          <div className="absolute -bottom-28 left-[-6%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_rgba(244,114,182,0.2),_rgba(255,255,255,0))]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-12">
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Knowledge Wiki
            </p>
            <h1 className="text-3xl font-semibold text-foreground">
              지식 위키
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              팀의 문서, 정책, 운영 가이드를 한 곳에 모아 탐색하는 공간입니다.
            </p>
          </div>

          <Card className="border border-border/70 bg-card/80 shadow-lg backdrop-blur">
            <CardContent className="flex flex-col gap-3 p-8 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                Coming Soon
              </p>
              <h2 className="text-2xl font-semibold text-foreground">
                Knowledge Wiki는 준비 중입니다.
              </h2>
              <p className="text-sm text-muted-foreground">
                구조와 기능이 정리되면 문서 체계를 차근차근 공개할게요.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedPage>
  );
}
