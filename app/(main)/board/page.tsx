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
import { Input } from "@/components/ui/input";

const boardItems = [
  {
    id: "B-3021",
    title: "보험 약관에서 보장 예외 조항이 어디에 있나요?",
    author: "김다은",
    createdAt: "2025-01-12 14:32",
    views: 142,
    status: "answered",
  },
  {
    id: "B-3018",
    title: "대출 계약서에서 중도상환 수수료 계산 방식",
    author: "이준호",
    createdAt: "2025-01-11 09:18",
    views: 98,
    status: "waiting",
  },
  {
    id: "B-3013",
    title: "서비스 이용약관 개정 이력 어디서 확인하나요?",
    author: "박서연",
    createdAt: "2025-01-10 16:05",
    views: 76,
    status: "answered",
  },
  {
    id: "B-3007",
    title: "개인정보 처리방침에서 보관 기간을 알고 싶어요.",
    author: "정민석",
    createdAt: "2025-01-09 11:42",
    views: 65,
    status: "waiting",
  },
  {
    id: "B-3002",
    title: "계약서 주요 리스크 체크리스트 공유합니다.",
    author: "최은지",
    createdAt: "2025-01-08 17:26",
    views: 184,
    status: "answered",
  },
];

const statusStyles: Record<string, string> = {
  waiting: "border border-amber-200 bg-amber-100/70 text-amber-800",
  answered: "border border-emerald-200 bg-emerald-100/70 text-emerald-800",
};

const statusLabels: Record<string, string> = {
  waiting: "답변대기",
  answered: "답변완료",
};

export default function BoardPage() {
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

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-12 text-[15px]">
          <section className="flex flex-col gap-4">
            <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
              Q&amp;A Board
            </p>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-semibold text-foreground">
                  문서 기반 질의응답
                </h1>
                <p className="max-w-2xl text-base text-muted-foreground">
                  업로드한 문서를 기반으로 팀의 질문과 답변을 모으고, 인사이트를
                  공유하는 공간입니다.
                </p>
              </div>
              <Button asChild size="lg">
                <Link href="/board/create">Q&amp;A 작성</Link>
              </Button>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-[1.1fr_0.9fr]">
            <Card className="border border-border/60 bg-background/70">
              <CardHeader className="gap-2 border-b border-border/60 pb-4">
                <CardTitle className="text-xl">문의 현황</CardTitle>
                <CardDescription className="text-base">
                  최근 등록된 Q&amp;A 요약입니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 text-base text-muted-foreground">
                <div className="flex items-center justify-between">
                  <span>전체 게시글</span>
                  <span className="text-lg font-semibold text-foreground">
                    {boardItems.length}건
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>답변 완료</span>
                  <span className="text-lg font-semibold text-foreground">
                    {boardItems.filter((item) => item.status === "answered").length}건
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>답변 대기</span>
                  <span className="text-lg font-semibold text-foreground">
                    {boardItems.filter((item) => item.status === "waiting").length}건
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-border/60 bg-background/70">
              <CardHeader className="gap-2 border-b border-border/60 pb-4">
                <CardTitle className="text-xl">빠른 검색</CardTitle>
                <CardDescription className="text-base">
                  제목이나 작성자로 검색하세요.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                <Input placeholder="예: 개인정보, 리스크, FAQ" />
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="default">
                    최신순
                  </Button>
                  <Button variant="outline" size="default">
                    조회수
                  </Button>
                  <Button variant="outline" size="default">
                    답변대기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-base text-muted-foreground">
              <span>
                총 <strong className="text-foreground">{boardItems.length}</strong>건
              </span>
              <span>최근 업데이트 기준</span>
            </div>

            <Card className="border border-border/60 bg-background/80">
              <CardContent className="px-0">
                <div className="hidden grid-cols-[90px_minmax(0,1fr)_140px_180px_90px] gap-4 border-b border-border/60 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground md:grid">
                  <span>번호</span>
                  <span>제목</span>
                  <span className="text-center">작성자</span>
                  <span className="text-center">작성일</span>
                  <span className="text-center">조회</span>
                </div>
                <div className="divide-y divide-border/60">
                  {boardItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 px-6 py-4 transition hover:bg-muted/40 md:grid md:grid-cols-[90px_minmax(0,1fr)_140px_180px_90px] md:items-center"
                    >
                      <div className="text-base font-medium text-foreground">{item.id}</div>
                      <div className="flex flex-col gap-2">
                        <span
                          className={`w-fit rounded-full px-2.5 py-1 text-sm font-medium ${statusStyles[item.status]}`}
                        >
                          {statusLabels[item.status]}
                        </span>
                        <Link
                          href="/board/detail"
                          className="text-base font-semibold text-foreground hover:underline"
                        >
                          {item.title}
                        </Link>
                      </div>
                      <div className="text-base text-muted-foreground md:text-center">
                        {item.author}
                      </div>
                      <div className="text-base text-muted-foreground md:text-center">
                        {item.createdAt}
                      </div>
                      <div className="text-base text-muted-foreground md:text-center">
                        {item.views}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

          </section>
        </div>
      </main>
    </ProtectedPage>
  );
}
