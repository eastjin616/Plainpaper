"use client";

import ProtectedPage from "@/app/_contexts/ProtectedPage";

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const isLocked = true;

  return (
    <ProtectedPage>
      <div className="relative min-h-screen bg-background">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div className="absolute -top-24 left-[10%] h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,_rgba(59,130,246,0.2),_rgba(255,255,255,0))]" />
          <div className="absolute -bottom-32 right-[-5%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_rgba(234,88,12,0.2),_rgba(255,255,255,0))]" />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-10">
          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Workspace analytics
                </p>
                <h1 className="text-3xl font-semibold text-foreground">Analytics</h1>
                <p className="max-w-xl text-sm text-muted-foreground">
                  팀과 관리자가 한눈에 문서 흐름과 AI 활용도를 확인하는 화면입니다.
                </p>
              </div>
              <div className="rounded-full border border-border bg-card px-4 py-2 text-xs text-muted-foreground">
                기준: workspace_id
              </div>
            </div>

          </div>

          <div className="flex flex-col gap-6">
            {isLocked ? (
              <div className="rounded-2xl border border-border/70 bg-card/80 p-10 text-center shadow-lg backdrop-blur">
                <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                  Coming Soon
                </p>
                <h2 className="mt-3 text-2xl font-semibold text-foreground">
                  Analytics는 준비 중입니다.
                </h2>
                <p className="mt-3 text-sm text-muted-foreground">
                  현재는 하드코딩 데이터로 구성되어 있어 잠시 비활성화했습니다.
                </p>
              </div>
            ) : (
              children
            )}
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
