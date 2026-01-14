"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function BoardCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const token = localStorage.getItem("token");
      // 생성 API는 contents 필드를 기대함.
      const res = await fetch(`${API_URL}/board`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ title, contents: content }),
      });

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => null);
        const message = errorPayload?.detail ?? "게시물 등록에 실패했습니다.";
        throw new Error(message);
      }

      const json = await res.json();
      const createdId =
        json?.board_id ??
        json?.id ??
        json?.data?.board_id ??
        json?.data?.id ??
        json?.data?.board?.id ??
        json?.data?.board_id;

      router.push(createdId ? `/board/${createdId}` : "/board");
    } catch (err) {
      console.error("🔥 게시물 등록 실패:", err);
      setError(err instanceof Error ? err.message : "게시물 등록에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

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
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full text-base"
                />
              </div>
              <div>
                <label className="block mb-2 text-base font-medium">내용</label>
                <Textarea
                  placeholder="게시물 내용을 입력하세요"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className="h-48 w-full text-base"
                />
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex justify-end">
                <Button
                  size="lg"
                  variant="default"
                  onClick={handleSubmit}
                  disabled={saving}
                >
                  {saving ? "등록 중..." : "작성 완료"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedPage>
  );
}
