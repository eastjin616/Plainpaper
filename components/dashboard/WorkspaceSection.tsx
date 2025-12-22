"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { WorkspaceItem } from "@/components/dashboard/types";

type WorkspaceSectionProps = {
  workspaces: WorkspaceItem[];
  activeWorkspace?: WorkspaceItem;
  onSelectWorkspace: (id: string) => void;
};

export default function WorkspaceSection({
  workspaces,
  activeWorkspace,
  onSelectWorkspace,
}: WorkspaceSectionProps) {
  return (
    <Card className="border-border bg-card/80 shadow-xl backdrop-blur">
      <CardContent className="flex flex-col gap-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">Workspace</p>
            <p className="text-xs text-muted-foreground">
              개인 / 팀 / 조직 단위로 문서를 관리합니다.
            </p>
          </div>
          <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Active
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {workspaces.map((workspace) => {
            const isActive = workspace.id === activeWorkspace?.id;
            return (
              <button
                key={workspace.id}
                type="button"
                onClick={() => onSelectWorkspace(workspace.id)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "border border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {workspace.name}
              </button>
            );
          })}
        </div>

        <div className="grid gap-3 rounded-2xl border border-border bg-background/80 p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-foreground">
                {activeWorkspace?.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {activeWorkspace?.type} Workspace · 멤버 {activeWorkspace?.members}명
              </p>
            </div>
            <div className="rounded-xl border border-border bg-card px-3 py-2 text-xs text-muted-foreground">
              문서 {activeWorkspace?.documents}개
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            {activeWorkspace?.summary}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
