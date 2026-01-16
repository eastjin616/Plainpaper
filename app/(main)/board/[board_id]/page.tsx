"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedPage from "@/app/_contexts/ProtectedPage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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

type BoardComment = {
  id: string;
  contents: string | null;
  createdAt: string;
  createdBy: string | null;
};

// 상세 응답 필드를 화면용 데이터로 정규화.
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

const normalizeBoardComment = (raw: any): BoardComment => ({
  id: raw?.id ?? "",
  contents: raw?.contents ?? "",
  createdAt: raw?.created_at ?? raw?.createdAt ?? "",
  createdBy: raw?.created_by ?? raw?.createdBy ?? null,
});

const formatDateTime = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

export default function BoardDetailPage() {
  const params = useParams();
  const router = useRouter();
  const boardId = params.board_id as string;

  const [detail, setDetail] = useState<BoardDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [comments, setComments] = useState<BoardComment[]>([]);
  const [commentInput, setCommentInput] = useState("");
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentError, setCommentError] = useState<string | null>(null);

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

  const loadComments = async () => {
    if (!boardId) return;
    try {
      setCommentsLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/board/${boardId}/comments`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        cache: "no-store",
      });

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => null);
        const message =
          errorPayload?.detail ?? "답변 정보를 불러오지 못했습니다.";
        throw new Error(message);
      }

      const json = await res.json();
      const items = Array.isArray(json?.items) ? json.items : [];
      setComments(items.map(normalizeBoardComment));
      setCommentError(null);
    } catch (err) {
      console.error("🔥 답변 불러오기 실패:", err);
      setCommentError(
        err instanceof Error ? err.message : "답변 정보를 불러오지 못했습니다."
      );
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, [boardId]);

  const handleDelete = async () => {
    if (!boardId || deleting) return;
    if (!confirm("게시물을 삭제할까요?")) return;

    try {
      setDeleting(true);
      const token = localStorage.getItem("token");
      // 삭제 API: DELETE /board/{board_id}
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

  const handleCommentSubmit = async () => {
    if (!boardId || commentSubmitting) return;
    const trimmed = commentInput.trim();
    if (!trimmed) {
      alert("답변 내용을 입력해주세요.");
      return;
    }

    try {
      setCommentSubmitting(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/board/${boardId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ contents: trimmed }),
      });

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => null);
        const message = errorPayload?.detail ?? "답변 등록에 실패했습니다.";
        throw new Error(message);
      }

      setCommentInput("");
      await loadComments();
    } catch (err) {
      console.error("🔥 답변 등록 실패:", err);
      alert(
        err instanceof Error ? err.message : "답변 등록에 실패했습니다."
      );
    } finally {
      setCommentSubmitting(false);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    if (!boardId || !commentId) return;
    if (!confirm("답변을 삭제할까요?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/board/${boardId}/comments/${commentId}`,
        {
          method: "DELETE",
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      if (!res.ok) {
        const errorPayload = await res.json().catch(() => null);
        const message = errorPayload?.detail ?? "답변 삭제에 실패했습니다.";
        throw new Error(message);
      }

      await loadComments();
    } catch (err) {
      console.error("🔥 답변 삭제 실패:", err);
      alert(
        err instanceof Error ? err.message : "답변 삭제에 실패했습니다."
      );
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
                      statusStyles[
                        comments.length > 0 ? "answered" : detail.status
                      ] ??
                      "border border-muted-foreground/30 bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {statusLabels[comments.length > 0 ? "answered" : detail.status] ??
                      detail.status}
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-lg font-semibold text-foreground">답변</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadComments}
                      disabled={commentsLoading}
                    >
                      {commentsLoading ? "불러오는 중..." : "새로고침"}
                    </Button>
                  </div>
                  {commentError && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
                      {commentError}
                    </div>
                  )}
                  <div className="space-y-3">
                    {commentsLoading && (
                      <div className="rounded-lg border border-border/60 bg-background p-4 text-muted-foreground">
                        답변을 불러오는 중입니다.
                      </div>
                    )}
                    {!commentsLoading && comments.length === 0 && (
                      <div className="rounded-lg border border-border/60 bg-background p-4 text-muted-foreground">
                        아직 등록된 답변이 없습니다.
                      </div>
                    )}
                    {!commentsLoading &&
                      comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="rounded-lg border border-border/60 bg-background p-4"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                            <span>
                              {comment.createdBy
                                ? `작성자 ${comment.createdBy}`
                                : "작성자 정보 없음"}
                            </span>
                            <span>{formatDateTime(comment.createdAt)}</span>
                          </div>
                          <p className="mt-2 whitespace-pre-line text-sm text-foreground">
                            {comment.contents || "내용 없음"}
                          </p>
                          <div className="mt-3 flex justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCommentDelete(comment.id)}
                            >
                              삭제
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="space-y-3 rounded-lg border border-border/60 bg-background p-4">
                    <Textarea
                      placeholder="답변을 입력하세요."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <div className="flex justify-end">
                      <Button
                        onClick={handleCommentSubmit}
                        disabled={commentSubmitting}
                      >
                        {commentSubmitting ? "등록 중..." : "답변 등록"}
                      </Button>
                    </div>
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
