"use client";
import ProtectedPage from "@/app/_contexts/ProtectedPage";

export default function BoardPage() {
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
                  Q&A Board
                </p>
                <h1 className="text-3xl font-semibold text-foreground">문서 기반 질의응답</h1>
                <p className="max-w-xl text-sm text-muted-foreground">
                  업로드한 문서를 바탕으로 팀원들과 질문하고 토론할 수 있는 공간입니다.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* Board content goes here */}
            <div className="h-96 w-full rounded-lg border-2 border-dashed border-muted-foreground/50 flex items-center justify-center text-muted-foreground">
              <p>Board content will be displayed here.</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}