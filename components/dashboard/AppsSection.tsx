"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Layers,
  LineChart,
  MessageCircleQuestion,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { AppItem } from "@/components/dashboard/types";

type AppsSectionProps = {
  apps: AppItem[];
  mode: "admin" | "user";
};

const iconMap = {
  "file-text": FileText,
  layers: Layers,
  "message-circle-question": MessageCircleQuestion,
  "line-chart": LineChart,
};

export default function AppsSection({ apps, mode }: AppsSectionProps) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-foreground">Installed Apps</p>
          <p className="text-xs text-muted-foreground">
            {mode === "admin"
              ? "AI Document Reader를 중심으로 앱을 확장합니다."
              : "지금 바로 실행 가능한 앱을 확인하세요."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="rounded-full border border-border bg-card px-2 py-1">
            {apps.filter((app) => app.status === "live").length} Active
          </span>
          <span className="rounded-full border border-border bg-card px-2 py-1">
            {apps.filter((app) => app.status === "soon").length} Coming
          </span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {apps.map((app, index) => {
          const Icon = app.icon ?? iconMap[app.iconName];
          return (
            <Card
              key={app.id}
              className={`border-border bg-card/80 shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4 ${
                index === 0 ? "delay-100" : index === 1 ? "delay-200" : "delay-300"
              }`}
            >
              <CardContent className="flex h-full flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="rounded-2xl border border-border bg-background p-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </span>
                    <div>
                      <p className="text-base font-semibold text-foreground">
                        {app.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {app.description}
                      </p>
                    </div>
                  </div>
                  {app.status === "soon" && (
                    <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                      Soon
                    </span>
                  )}
                </div>

                <div className="mt-auto flex items-center justify-between">
                  {app.status === "live" ? (
                    <Button asChild className="gap-2">
                      <Link href={app.href ?? "/"}>
                        {app.cta}
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  ) : (
                    <span className="rounded-full border border-border bg-background px-3 py-2 text-xs text-muted-foreground">
                      {app.cta}
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    Workspace 기반 액세스
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
