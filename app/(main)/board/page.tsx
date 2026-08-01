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
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const statusStyles: Record<string, string> = {
  waiting: "border border-amber-200 bg-amber-100/70 text-amber-800",
  answered: "border border-emerald-200 bg-emerald-100/70 text-emerald-800",
};

const statusLabels: Record<string, string> = {
  waiting: "답변대기",
  answered: "답변완료",
};

type BoardItem = {
  id: string;
  title: string;
  author: string;
  createdAt: string;
  views: number;
  status: string;
  isImportant: boolean;
  commentCount?: number;
};

// 백엔드는 yyyy-mm-dd 형식의 날짜 파라미터를 기대함.
const formatDate = (date: Date) => date.toISOString().slice(0, 10);

// 목록 기본 조회는 이번 달 범위로 설정.
const getDefaultDateRange = () => {
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth(), 1);
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    startDate: formatDate(start),
    endDate: formatDate(end),
  };
};

const formatCreatedAt = (value: string) => {
  if (!value) return "";
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString("sv-SE").replace("T", " ");
};

// 백엔드 응답 필드를 UI용 데이터로 정규화.
const normalizeBoardItem = (raw: any): BoardItem => {
  const commentCountValue =
    raw?.comment_count ??
    raw?.comments_count ??
    raw?.commentsCount ??
    (Array.isArray(raw?.comments) ? raw.comments.length : undefined);
  const commentCount = Number.isFinite(Number(commentCountValue))
    ? Number(commentCountValue)
    : undefined;
  const hasComments = typeof commentCount === "number" ? commentCount > 0 : false;
  const answered = hasComments || Boolean(raw?.accepted_comment_);
  return {
    id: raw?.id ?? raw?.board_id ?? "",
    title: raw?.title ?? raw?.subject ?? "",
    author: raw?.created_by ?? raw?.author ?? raw?.writer ?? "",
    createdAt: raw?.created_at ?? raw?.createdAt ?? "",
    views: Number(raw?.view_count ?? raw?.views ?? 0),
    status: answered ? "answered" : "waiting",
    isImportant: Boolean(raw?.is_important),
    commentCount,
  };
};

export default function BoardPage() {
  const [items, setItems] = useState<BoardItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"latest" | "views">("latest");
  const [statusFilter, setStatusFilter] = useState<"all" | "answered" | "waiting">(
    "all"
  );
  const [page] = useState(1);
  const [size] = useState(20);

  useEffect(() => {
    const { startDate, endDate } = getDefaultDateRange();

    async function loadBoards() {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          page: String(page),
          size: String(size),
          start_date: startDate,
          end_date: endDate,
        });

        const headers: HeadersInit = {};
        const token = localStorage.getItem("token");
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        // 목록 API: GET /board?page=&size=&start_date=&end_date=
        const res = await fetch(`${API_URL}/board?${params.toString()}`, {
          headers,
          cache: "no-store",
        });

        if (!res.ok) {
          const errorPayload = await res.json().catch(() => null);
          const message = errorPayload?.detail ?? "게시판 목록을 불러오지 못했습니다.";
          throw new Error(message);
        }

        const json = await res.json();
        const rawItems = Array.isArray(json)
          ? json
          : Array.isArray(json?.items)
          ? json.items
          : Array.isArray(json?.boards)
          ? json.boards
          : Array.isArray(json?.data?.items)
          ? json.data.items
          : Array.isArray(json?.data)
          ? json.data
          : [];

        const normalizedItems: BoardItem[] = rawItems.map(normalizeBoardItem);
        setItems(normalizedItems);
        setTotal(
          Number(
            json?.total ??
              json?.data?.total ??
              json?.meta?.total ??
              rawItems.length
          )
        );
        setError(null);

        const pendingItems = normalizedItems.filter(
          (item) => item.status === "waiting" && item.commentCount == null
        );

        if (pendingItems.length > 0) {
          const commentHeaders: HeadersInit = {};
          const token = localStorage.getItem("token");
          if (token) {
            commentHeaders.Authorization = `Bearer ${token}`;
          }

          const results = await Promise.all(
            pendingItems.map(async (item) => {
              try {
                const res = await fetch(
                  `${API_URL}/board/${item.id}/comments?page=1&size=1`,
                  {
                    headers: commentHeaders,
                    cache: "no-store",
                  }
                );

                if (!res.ok) return item;

                const data = await res.json();
                const totalCount = Number(
                  data?.total ??
                    data?.data?.total ??
                    (Array.isArray(data?.items) ? data.items.length : 0)
                );
                if (!Number.isFinite(totalCount)) return item;

                return totalCount > 0
                  ? { ...item, status: "answered", commentCount: totalCount }
                  : item;
              } catch (err) {
                console.error("🔥 답변 상태 조회 실패:", err);
                return item;
              }
            })
          );

          const updatedMap = new Map(
            results.map((updated) => [updated.id, updated])
          );
          setItems((prev) =>
            prev.map((item) => updatedMap.get(item.id) ?? item)
          );
        }
      } catch (err) {
        console.error("🔥 게시판 목록 불러오기 실패:", err);
        setError(
          err instanceof Error ? err.message : "게시판 데이터를 불러오지 못했습니다."
        );
        setItems([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    loadBoards();
  }, [page, size]);

  const filteredItems = useMemo(() => {
    const lowered = query.trim().toLowerCase();
    const filtered = items.filter((item) => {
      const matchesQuery =
        !lowered ||
        item.title.toLowerCase().includes(lowered) ||
        item.author.toLowerCase().includes(lowered);
      const matchesStatus =
        statusFilter === "all" ? true : item.status === statusFilter;
      return matchesQuery && matchesStatus;
    });

    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "views") {
        return b.views - a.views;
      }
      const aTime = Date.parse(a.createdAt) || 0;
      const bTime = Date.parse(b.createdAt) || 0;
      return bTime - aTime;
    });

    return sorted;
  }, [items, query, sortBy, statusFilter]);

  const getDisplayNumber = (index: number) => {
    const hasFilters = query.trim().length > 0 || statusFilter !== "all";
    const baseTotal = hasFilters ? filteredItems.length : total || items.length;
    return baseTotal - (page - 1) * size - index;
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
                    {total || items.length}건
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>답변 완료</span>
                  <span className="text-lg font-semibold text-foreground">
                    {items.filter((item) => item.status === "answered").length}건
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>답변 대기</span>
                  <span className="text-lg font-semibold text-foreground">
                    {items.filter((item) => item.status === "waiting").length}건
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
                <Input
                  placeholder="예: 개인정보, 리스크, FAQ"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={sortBy === "latest" ? "default" : "outline"}
                    size="default"
                    onClick={() => setSortBy("latest")}
                  >
                    최신순
                  </Button>
                  <Button
                    variant={sortBy === "views" ? "default" : "outline"}
                    size="default"
                    onClick={() => setSortBy("views")}
                  >
                    조회수
                  </Button>
                  <Button
                    variant={statusFilter === "waiting" ? "default" : "outline"}
                    size="default"
                    onClick={() =>
                      setStatusFilter(
                        statusFilter === "waiting" ? "all" : "waiting"
                      )
                    }
                  >
                    답변대기
                  </Button>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between text-base text-muted-foreground">
              <span>
                총 <strong className="text-foreground">{filteredItems.length}</strong>건
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
                  {loading && (
                    <div className="px-6 py-10 text-center text-muted-foreground">
                      게시판을 불러오는 중입니다.
                    </div>
                  )}
                  {!loading && error && (
                    <div className="px-6 py-10 text-center text-destructive">
                      {error}
                    </div>
                  )}
                  {!loading && !error && filteredItems.length === 0 && (
                    <div className="px-6 py-10 text-center text-muted-foreground">
                      {items.length === 0 && !query.trim() && statusFilter === "all"
                        ? "게시판이 없습니다."
                        : "조건에 맞는 게시글이 없습니다."}
                    </div>
                  )}
                  {!loading &&
                    !error &&
                    filteredItems.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 px-6 py-4 transition hover:bg-muted/40 md:grid md:grid-cols-[90px_minmax(0,1fr)_140px_180px_90px] md:items-center"
                    >
                      <div className="text-base font-medium text-foreground">
                        {item.isImportant ? (
                          <span className="inline-flex items-center justify-center">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth="1.5"
                              stroke="currentColor"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 3v1.5M3 21v-6m0 0 2.77-.693a9 9 0 0 1 6.208.682l.108.054a9 9 0 0 0 6.086.71l3.114-.732a48.524 48.524 0 0 1-.005-10.499l-3.11.732a9 9 0 0 1-6.085-.711l-.108-.054a9 9 0 0 0-6.208-.682L3 4.5M3 15V4.5"
                              />
                            </svg>
                          </span>
                        ) : (
                          getDisplayNumber(index)
                        )}
                      </div>
                      <div className="flex flex-col gap-2">
                        <span
                          className={`w-fit rounded-full px-2.5 py-1 text-sm font-medium ${
                            statusStyles[item.status] ??
                            "border border-muted-foreground/30 bg-muted/40 text-muted-foreground"
                          }`}
                        >
                          {statusLabels[item.status] ?? item.status}
                        </span>
                        <Link
                          href={`/board/${item.id}`}
                          className="text-base font-semibold text-foreground hover:underline"
                        >
                          {item.title}
                        </Link>
                      </div>
                      <div className="text-base text-muted-foreground md:text-center">
                        {item.author}
                      </div>
                      <div className="text-base text-muted-foreground md:text-center">
                        {formatCreatedAt(item.createdAt)}
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
