"use client";

import { Card, CardContent } from "@/components/ui/card";
import type { ActivityItem } from "@/components/dashboard/types";

type ActivitySectionProps = {
  activities: ActivityItem[];
};

export default function ActivitySection({ activities }: ActivitySectionProps) {
  return (
    <Card className="border-border bg-card/70 shadow-xl backdrop-blur">
      <CardContent className="flex h-full flex-col gap-5 p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-foreground">Recent Activity</p>
            <p className="text-xs text-muted-foreground">
              최근 실행된 AI 작업과 문서 흐름을 확인하세요.
            </p>
          </div>
          <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Live
          </span>
        </div>

        <div className="flex flex-col gap-3">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className={`flex items-start justify-between gap-3 rounded-xl border border-border bg-background/80 p-4 text-sm shadow-sm animate-in fade-in slide-in-from-bottom-3 ${
                index === 0 ? "delay-100" : index === 1 ? "delay-200" : "delay-300"
              }`}
            >
              <div className="flex flex-col gap-1">
                <p className="font-medium text-foreground">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.app}</p>
              </div>
              <div className="flex flex-col items-end gap-1 text-xs text-muted-foreground">
                <span className="rounded-full border border-border bg-card px-2 py-1">
                  {activity.status}
                </span>
                <span>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto rounded-xl border border-dashed border-border bg-background/60 p-4 text-xs text-muted-foreground">
          Activity Log는 Workspace 기준으로 누적됩니다.
        </div>
      </CardContent>
    </Card>
  );
}
