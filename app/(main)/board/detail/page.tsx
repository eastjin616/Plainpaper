"use client";

import Link from "next/link";
import ProtectedPage from "@/app/_contexts/ProtectedPage";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const statusStyles: Record<string, string> = {
  waiting: "border border-amber-200 bg-amber-100/70 text-amber-800",
  answered: "border border-emerald-200 bg-emerald-100/70 text-emerald-800",
};

const statusLabels: Record<string, string> = {
  waiting: "답변대기",
  answered: "답변완료",
};

const boardDetail = {
  id: "B-3021",
  title: "보험 약관에서 보장 예외 조항이 어디에 있나요?",
  author: "김다은",
  createdAt: "2025-01-12 14:32",
  views: 142,
  status: "answered",
  content:
    "약관 4.3절에 예외 조항이 있다고 들었는데, 실제 문서에서는 어느 섹션에서 확인할 수 있나요?",
  answer:
    "문서 본문 8페이지에 위치한 '보장 제외 사항' 섹션에서 확인 가능합니다. '특약' 파트와 함께 읽으면 해석이 쉬워집니다.",
};

export default function BoardDetailPage() {
  return (
    <ProtectedPage>
      <main className="relative min-h-screen bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-24 left-[8%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(56,189,248,0.2),_rgba(255,255,255,0))]" />
          <div className="absolute -bottom-32 right-[-8%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_rgba(251,146,60,0.2),_rgba(255,255,255,0))]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 py-12 text-[15px]">
          <section className="flex flex-col gap-3">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Q&amp;A Board
            </p>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-semibold text-foreground">
                  Q&amp;A 상세
                </h1>
                <p className="text-base text-muted-foreground">
                  질문과 답변을 확인하고 필요한 내용을 편집할 수 있습니다.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="default" asChild>
                  <Link href="/board">목록</Link>
                </Button>
                <Button size="default" asChild>
                  <Link href="/board/edit">수정</Link>
                </Button>
              </div>
            </div>
          </section>

          <Card className="border border-border/60 bg-background/80">
            <CardHeader className="gap-2 border-b border-border/60 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-2xl">{boardDetail.title}</CardTitle>
                <span
                  className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${statusStyles[boardDetail.status]}`}
                >
                  {statusLabels[boardDetail.status]}
                </span>
              </div>
              <CardDescription className="text-base">
                작성자 {boardDetail.author} · {boardDetail.createdAt} · 조회{" "}
                {boardDetail.views}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-base">
              <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-foreground">
                {boardDetail.content}
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-foreground">답변</p>
                <div className="rounded-lg border border-border/60 bg-background p-4 text-muted-foreground">
                  {boardDetail.answer}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedPage>
  );
}
