"use client";

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

export default function BoardCreatePage() {
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
            <h1 className="text-4xl font-semibold text-foreground">새 게시물 작성</h1>
            <p className="text-base text-muted-foreground">
              궁금한 점이나 공유하고 싶은 정보를 정리해서 남겨주세요.
            </p>
          </section>

          <Card className="border border-border/60 bg-background/80">
            <CardHeader className="gap-2 border-b border-border/60 pb-4">
              <CardTitle className="text-xl">내용 작성</CardTitle>
              <CardDescription className="text-base">
                제목과 내용을 작성한 뒤 게시물을 등록할 수 있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block mb-2 text-base font-medium">제목</label>
                <Input
                  type="text"
                  placeholder="게시물 제목을 입력하세요"
                  className="w-full text-base"
                />
              </div>
              <div>
                <label className="block mb-2 text-base font-medium">내용</label>
                <Textarea
                  placeholder="게시물 내용을 입력하세요"
                  className="h-48 w-full text-base"
                />
              </div>
              <div className="flex justify-end">
                <Button size="lg" variant="default">
                  작성 완료
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedPage>
  );
}
