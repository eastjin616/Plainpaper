"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import ActivitySection from "@/components/dashboard/ActivitySection";
import AppsSection from "@/components/dashboard/AppsSection";
import WorkspaceSection from "@/components/dashboard/WorkspaceSection";
import type {
  ActivityItem,
  AppItem,
  WorkspaceItem,
} from "@/components/dashboard/types";
import { useAuth } from "@/app/_contexts/AuthContext";

const workspaces: WorkspaceItem[] = [
  {
    id: "personal",
    name: "My Job Search",
    type: "개인",
    members: "1",
    documents: 12,
    summary: "최근 7일 동안 4건의 이력서가 분석되었습니다.",
  },
  {
    id: "team",
    name: "Interview Prep",
    type: "스터디",
    members: "3",
    documents: 8,
    summary: "모의면접 세션이 활성화되었습니다.",
  },
  {
    id: "org",
    name: "CareerPilot Labs",
    type: "조직",
    members: "24",
    documents: 148,
    summary: "이번 주 이력서 분석 22건 진행 중.",
  },
];

const activities: ActivityItem[] = [
  {
    id: "act-1",
    title: "백엔드 이력서 ATS 분석",
    app: "ATS Analyzer",
    status: "완료",
    time: "방금 전",
  },
  {
    id: "act-2",
    title: "지원동기 자소서 첨삭",
    app: "Essay Studio",
    status: "진행 중",
    time: "15분 전",
  },
  {
    id: "act-3",
    title: "모의면접 세션",
    app: "AI Interview",
    status: "완료",
    time: "어제",
  },
];

const apps: AppItem[] = [
  {
    id: "ats",
    name: "ATS Analyzer",
    description: "이력서를 업로드하고 ATS 점수·개선 포인트를 확인하세요.",
    status: "live",
    cta: "분석하기",
    href: "/upload",
    iconName: "file-text",
  },
  {
    id: "essay",
    name: "Essay Studio",
    description: "AI가 자소서를 첨삭해주는 스튜디오.",
    status: "live",
    cta: "첨삭하기",
    href: "/essay",
    iconName: "layers",
  },
  {
    id: "interview",
    name: "AI Interview",
    description: "이력서 기반 질문 생성과 STAR 피드백 모의면접.",
    status: "live",
    cta: "연습하기",
    href: "/interview",
    iconName: "message-circle-question",
  },
  {
    id: "applications",
    name: "Application Tracker",
    description: "지원 현황을 한눈에 관리하는 트래커.",
    status: "live",
    cta: "관리하기",
    href: "/applications",
    iconName: "line-chart",
  },
];
//dashboard page
export default function Dashboard() {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(workspaces[0]?.id);
  const [mode, setMode] = useState<"admin" | "user">("admin");
  const { user, loading } = useAuth();
  const isAdmin = user?.role === "admin";
  const effectiveMode = isAdmin ? mode : "user";

  useEffect(() => {
    if (loading) return;
    setMode(isAdmin ? "admin" : "user");
  }, [isAdmin, loading]);
  const activeWorkspace = useMemo(
    () => workspaces.find((item) => item.id === activeWorkspaceId) ?? workspaces[0],
    [activeWorkspaceId]
  );

  return (
    <main className="relative min-h-screen bg-background">
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
            Open Source · AI 취업 코파일럿
          </div>
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              대시보드
            </h1>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
              이력서 분석, 자소서 첨삭, 모의면접, 지원 관리를 한 곳에서.
              CareerPilot은 당신의 취업 여정을 함께합니다.
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
          <WorkspaceSection
            workspaces={workspaces}
            activeWorkspace={activeWorkspace}
            onSelectWorkspace={setActiveWorkspaceId}
          />
          {effectiveMode === "admin" && <ActivitySection activities={activities} />}
        </section>

        <AppsSection apps={apps} mode={effectiveMode} />
      </div>
    </main>
  );
}
