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
import { Textarea } from "@/components/ui/textarea";

const boardDetail = {
  title: "보험 약관에서 보장 예외 조항이 어디에 있나요?",
  content:
    "약관 4.3절에 예외 조항이 있다고 들었는데, 실제 문서에서는 어느 섹션에서 확인할 수 있나요?",
};

export default function BoardEditPage() {
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
            <h1 className="text-4xl font-semibold text-foreground">게시물 수정</h1>
            <p className="text-base text-muted-foreground">
              제목과 내용을 편집하고 변경 사항을 저장하세요.
            </p>
          </section>

          <Card className="border border-border/60 bg-background/80">
            <CardHeader className="gap-2 border-b border-border/60 pb-4">
              <CardTitle className="text-xl">내용 편집</CardTitle>
              <CardDescription className="text-base">
                변경한 내용은 저장 후 바로 반영됩니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block mb-2 text-base font-medium">제목</label>
                <Input
                  type="text"
                  defaultValue={boardDetail.title}
                  className="w-full text-base"
                />
              </div>
              <div>
                <label className="block mb-2 text-base font-medium">내용</label>
                <Textarea
                  defaultValue={boardDetail.content}
                  className="h-48 w-full text-base"
                />
              </div>
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline" size="lg" asChild>
                  <Link href="/board/detail">취소</Link>
                </Button>
                <Button size="lg" variant="default">
                  수정 완료
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedPage>
  );
}
