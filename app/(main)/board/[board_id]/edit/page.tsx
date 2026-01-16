"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

type BoardDetail = {
  title: string;
  content: string;
  isImportant: boolean;
};

// 상세 응답 필드를 화면용 데이터로 정규화.
const normalizeBoardDetail = (raw: any): BoardDetail => ({
  title: raw?.title ?? raw?.subject ?? "",
  content: raw?.contents ?? raw?.content ?? raw?.question ?? "",
  isImportant: Boolean(raw?.is_important),
});

export default function BoardEditPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.board_id as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (!boardId) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        // 상세 API: GET /board/{board_id}
        const res = await fetch(`${API_URL}/board/${boardId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
          cache: "no-store",
        });

        if (!res.ok) {
          const errorPayload = await res.json().catch(() => null);
          const message = errorPayload?.detail ?? "게시물 정보를 불러오지 못했습니다.";
          throw new Error(message);
        }

        const json = await res.json();
        const rawDetail = json?.data ?? json?.board ?? json;
        const normalized = normalizeBoardDetail(rawDetail);
        setTitle(normalized.title);
        setContent(normalized.content);
        setIsImportant(normalized.isImportant);
        setError(null);
      } catch (err) {
        console.error("🔥 게시물 불러오기 실패:", err);
        setError(
          err instanceof Error ? err.message : "게시물 정보를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [boardId]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const token = localStorage.getItem("token");
      // 수정 API는 contents 필드를 기대함.
      const res = await fetch(`${API_URL}/board/${boardId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title,
          contents: content,
          is_important: isImportant,
        }),
      });

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => null);
        const message = errorPayload?.detail ?? "게시물 수정에 실패했습니다.";
        throw new Error(message);
      }

      router.push(`/board/${boardId}`);
    } catch (err) {
      console.error("🔥 게시물 수정 실패:", err);
      setError(err instanceof Error ? err.message : "게시물 수정에 실패했습니다.");
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
              {loading && (
                <div className="text-sm text-muted-foreground">
                  게시물 정보를 불러오는 중입니다.
                </div>
              )}
              <div>
                <label className="block mb-2 text-base font-medium">제목</label>
                <Input
                  type="text"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  className="w-full text-base"
                />
              </div>
              <div>
                <label className="block mb-2 text-base font-medium">내용</label>
                <Textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  className="h-48 w-full text-base"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 px-4 py-3">
                <div>
                  <p className="text-base font-medium">FAQ 상단 고정</p>
                  <p className="text-sm text-muted-foreground">
                    켜면 FAQ로 표시되고 목록 상단에 고정됩니다.
                  </p>
                </div>
                <Button
                  type="button"
                  variant={isImportant ? "default" : "outline"}
                  onClick={() => setIsImportant((prev) => !prev)}
                >
                  {isImportant ? "FAQ On" : "FAQ Off"}
                </Button>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <div className="flex flex-wrap justify-end gap-2">
                <Button variant="outline" size="lg" asChild>
                  <Link href={`/board/${boardId}`}>취소</Link>
                </Button>
                <Button size="lg" variant="default" onClick={handleSave} disabled={saving}>
                  {saving ? "저장 중..." : "수정 완료"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedPage>
  );
}
