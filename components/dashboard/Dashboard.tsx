"use client";

import { useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import ActivitySection from "@/components/dashboard/ActivitySection";
import AppsSection from "@/components/dashboard/AppsSection";
import WorkspaceSection from "@/components/dashboard/WorkspaceSection";
import type {
  ActivityItem,
  AppItem,
  WorkspaceItem,
} from "@/components/dashboard/types";

const workspaces: WorkspaceItem[] = [
  {
    id: "personal",
    name: "Personal Workspace",
    type: "개인",
    members: "1",
    documents: 12,
    summary: "최근 7일 동안 4건의 문서가 요약되었습니다.",
  },
  {
    id: "team",
    name: "Design Team",
    type: "팀",
    members: "6",
    documents: 34,
    summary: "문서 리뷰 흐름이 활성화되었습니다.",
  },
  {
    id: "org",
    name: "Plainpaper Labs",
    type: "조직",
    members: "24",
    documents: 148,
    summary: "이번 주 문서 분석 22건 진행 중.",
  },
];

const activities: ActivityItem[] = [
  {
    id: "act-1",
    title: "보험 약관 요약",
    app: "AI Document Reader",
    status: "완료",
    time: "방금 전",
  },
  {
    id: "act-2",
    title: "서비스 이용약관 하이라이트",
    app: "AI Document Reader",
    status: "진행 중",
    time: "15분 전",
  },
  {
    id: "act-3",
    title: "대출 계약서 Q&A",
    app: "AI Document Reader",
    status: "완료",
    time: "어제",
  },
];

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
    status: "soon",
    cta: "Coming Soon",
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
];

export default function Dashboard() {
  const [activeWorkspaceId, setActiveWorkspaceId] = useState(workspaces[0]?.id);
  const [mode, setMode] = useState<"admin" | "user">("admin");
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
              className={`rounded-full px-4 py-2 font-medium transition ${
                mode === "admin"
                  ? "bg-primary text-primary-foreground shadow"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              관리자 모드
            </button>
            <button
              type="button"
              onClick={() => setMode("user")}
              className={`rounded-full px-4 py-2 font-medium transition ${
                mode === "user"
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
          {mode === "admin" && <ActivitySection activities={activities} />}
        </section>

        <AppsSection apps={apps} mode={mode} />
      </div>
    </main>
  );
}
