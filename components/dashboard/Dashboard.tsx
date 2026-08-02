"use client";

import { useMemo, useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import ActivitySection from "@/components/dashboard/ActivitySection";
import DocumentStatsSection from "@/components/dashboard/DocumentStatsSection";
import AppsSection from "@/components/dashboard/AppsSection";
import type { ActivityItem, AppItem, DocStats } from "@/components/dashboard/types";
import type { DocumentItem } from "@/app/_types/document";
import { useAnalytics } from "@/components/analytics/use-analytics";
import { useAuth } from "@/app/_contexts/AuthContext";
import SeniorHubModal from "@/components/dashboard/SeniorHubModal";

const apps: AppItem[] = [
  {
    id: "reader",
    name: "AI Document Reader",
    description: "문서를 업로드하고 요약, 하이라이트, Q&A까지.",
    status: "live",
    cta: "열기",
    href: "/upload",
    iconName: "file-text",
  },
  {
    id: "wiki",
    name: "Knowledge Wiki",
    description: "팀 지식을 구조화하고 검색 가능한 위키로.",
    status: "soon",
    cta: "Coming Soon",
    iconName: "layers",
  },
  {
    id: "qa",
    name: "Q&A Board",
    description: "문서 기반 질의응답과 토론이 모이는 공간.",
    status: "live",
    cta: "열기",
    href: "/board",
    iconName: "message-circle-question",
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "워크스페이스 전반의 문서 흐름을 한눈에.",
    status: "live",
    cta: "열기",
    href: "/analytics",
    iconName: "line-chart",
  },
  {
    id: "senior",
    name: "노후 준비 체크",
    description: "재무·건강·여가·대인관계 4영역으로 노후 준비도를 진단.",
    status: "live",
    cta: "열기",
    href: "/senior",
    iconName: "heart-pulse",
  },
];

const statusLabel: Record<string, string> = {
  done: "분석 완료",
  error: "실패",
  pending: "분석 중",
  processing: "분석 중",
};

const relativeTime = (createdAt: string) => {
  if (!createdAt) return "";
  const parsed = new Date(`${createdAt}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return createdAt;
  const days = Math.floor(
    (Date.now() - parsed.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (days <= 0) return "오늘";
  if (days === 1) return "어제";
  return `${days}일 전`;
};

export default function Dashboard() {
  const [mode, setMode] = useState<"admin" | "user">("admin");
  const [hubOpen, setHubOpen] = useState(false);
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const effectiveMode = isAdmin ? mode : "user";

  useEffect(() => {
    let seen = "false";
    try {
      seen = localStorage.getItem("plainpaper_hub_seen") ?? "false";
    } catch {
      seen = "false";
    }
    if (seen !== "true") {
      const timer = setTimeout(() => setHubOpen(true), 400);
      return () => clearTimeout(timer);
    }
  }, []);

  const closeHub = () => {
    try {
      localStorage.setItem("plainpaper_hub_seen", "true");
    } catch {
      // ignore
    }
    setHubOpen(false);
  };

  const { data, loading } = useAnalytics<{ documents: DocumentItem[] }>(
    "/documents/list"
  );

  const docs = useMemo(() => data?.documents ?? [], [data]);

  const stats: DocStats = useMemo(() => {
    return docs.reduce<DocStats>(
      (acc, doc) => {
        acc.total += 1;
        if (doc.status === "done") acc.done += 1;
        else if (doc.status === "error") acc.error += 1;
        else acc.processing += 1;
        return acc;
      },
      { total: 0, done: 0, processing: 0, error: 0 }
    );
  }, [docs]);

  const recentDoc = useMemo(
    () => docs[0] ?? null,
    [docs]
  );

  const activities: ActivityItem[] = useMemo(
    () =>
      docs.slice(0, 5).map((doc) => ({
        id: doc.document_id,
        title: doc.file_name,
        app: "AI Document Reader",
        status: statusLabel[doc.status] ?? doc.status,
        time: relativeTime(doc.created_at),
        author: doc.member_name ?? undefined,
      })),
    [docs]
  );

  return (
    <main className="relative min-h-screen bg-background">
      <SeniorHubModal open={hubOpen} onOpenChange={(v) => (v ? setHubOpen(true) : closeHub())} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 right-[-10%] h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.25),_rgba(255,255,255,0))]" />
        <div className="absolute -bottom-40 left-[-10%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.28),_rgba(255,255,255,0))]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-12">
        <section className="flex flex-col gap-6">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground shadow-sm">
            <Sparkles className="h-3 w-3 text-primary" />
            Workspace 중심 AI 그룹웨어
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              대시보드
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              문서는 Workspace에 귀속되고, 모든 앱은 워크플로우 중심으로 연결됩니다.
              지금은 대표 App인 Document Reader를 중심으로 경험을 확장합니다.
            </p>
          </div>
          <div className="flex w-fit items-center gap-2 rounded-full border border-border bg-background/80 p-1 text-xs">
            <button
              type="button"
              onClick={() => setMode("admin")}
              disabled={!isAdmin}
              className={`rounded-full px-4 py-2 font-medium transition ${
                effectiveMode === "admin"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              } ${!isAdmin ? "cursor-not-allowed opacity-60" : ""}`}
            >
              관리자 모드
            </button>
            <button
              type="button"
              onClick={() => setMode("user")}
              className={`rounded-full px-4 py-2 font-medium transition ${
                effectiveMode === "user"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              사용자 모드
            </button>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <DocumentStatsSection stats={stats} recentDoc={recentDoc} />
          {effectiveMode === "admin" && (
            <ActivitySection activities={activities} loading={loading} />
          )}
        </section>

        <AppsSection apps={apps} mode={effectiveMode} />
      </div>
    </main>
  );
}
