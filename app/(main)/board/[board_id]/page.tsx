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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const statusStyles: Record<string, string> = {
  waiting: "border border-amber-200 bg-amber-100/70 text-amber-800",
  answered: "border border-emerald-200 bg-emerald-100/70 text-emerald-800",
};

const statusLabels: Record<string, string> = {
  waiting: "답변대기",
  answered: "답변완료",
};

type BoardDetail = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  status: string;
  content: string;
  answer: string | null;
};

// Normalize backend detail payload.
const normalizeBoardDetail = (raw: any): BoardDetail => ({
  id: raw?.id ?? raw?.board_id ?? "",
  title: raw?.title ?? raw?.subject ?? "",
  author: raw?.created_by ?? raw?.author ?? raw?.writer ?? "",
  createdAt: raw?.created_at ?? raw?.createdAt ?? "",
  views: Number(raw?.view_count ?? raw?.views ?? 0),
  status: raw?.accepted_comment_ ? "answered" : "waiting",
  content: raw?.contents ?? raw?.content ?? raw?.question ?? "",
  answer: raw?.answer ?? raw?.response ?? null,
});

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.board_id as string;

  const [detail, setDetail] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    async function loadDetail() {
      if (!boardId) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        // Detail API: GET /board/{board_id}
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
        setDetail(normalizeBoardDetail(rawDetail));
        setError(null);
      } catch (err) {
        console.error("🔥 게시물 불러오기 실패:", err);
        setError(
          err instanceof Error ? err.message : "게시물 정보를 불러오지 못했습니다."
        );
        setDetail(null);
      } finally {
        setLoading(false);
      }
    }

    loadDetail();
  }, [boardId]);

  const handleDelete = async () => {
    if (!boardId || deleting) return;
    if (!confirm("게시물을 삭제할까요?")) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      // Delete API: DELETE /board/{board_id}
      const res = await fetch(`${API_URL}/board/${boardId}`, {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      if (!res.ok) {
        throw new Error("게시물 삭제에 실패했습니다.");
      }

      router.push("/board");
    } catch (err) {
      console.error("🔥 게시물 삭제 실패:", err);
      alert("게시물 삭제에 실패했습니다.");
    } finally {
      setDeleting(false);
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
                <Button variant="outline" size="default" onClick={handleDelete}>
                  {deleting ? "삭제 중..." : "삭제"}
                </Button>
                <Button size="default" asChild>
                  <Link href={`/board/${boardId}/edit`}>수정</Link>
                </Button>
              </div>
            </div>
          </section>

          {loading && (
            <Card className="border border-border/60 bg-background/80">
              <CardContent className="p-10 text-center text-muted-foreground">
                게시물 정보를 불러오는 중입니다.
              </CardContent>
            </Card>
          )}

          {!loading && error && (
            <Card className="border border-border/60 bg-background/80">
              <CardContent className="p-10 text-center text-destructive">
                {error}
              </CardContent>
            </Card>
          )}

          {!loading && !error && detail && (
            <Card className="border border-border/60 bg-background/80">
              <CardHeader className="gap-2 border-b border-border/60 pb-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <CardTitle className="text-2xl">{detail.title}</CardTitle>
                  <span
                    className={`w-fit rounded-full px-3 py-1 text-sm font-medium ${
                      statusStyles[detail.status] ??
                      "border border-muted-foreground/30 bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {statusLabels[detail.status] ?? detail.status}
                  </span>
                </div>
                <CardDescription className="text-base">
                  작성자 {detail.author} · {detail.createdAt} · 조회 {detail.views}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 text-base">
                <div className="rounded-lg border border-border/60 bg-muted/40 p-4 text-foreground">
                  {detail.content || "질문 내용이 없습니다."}
                </div>
                <div className="space-y-2">
                  <p className="text-lg font-semibold text-foreground">답변</p>
                  <div className="rounded-lg border border-border/60 bg-background p-4 text-muted-foreground">
                    {detail.answer || "아직 등록된 답변이 없습니다."}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </ProtectedPage>
  );
}
