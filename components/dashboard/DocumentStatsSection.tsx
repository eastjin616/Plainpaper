"use client";

import Link from "next/link";
import { FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { DocStats } from "@/components/dashboard/types";
import type { DocumentItem } from "@/app/_types/document";

type DocumentStatsSectionProps = {
  stats: DocStats;
  recentDoc?: DocumentItem | null;
};

export default function DocumentStatsSection({
  stats,
  recentDoc,
}: DocumentStatsSectionProps) {
  const tiles = [
    { label: "전체 문서", value: stats.total, accent: "text-foreground" },
    { label: "분석 완료", value: stats.done, accent: "text-emerald-600" },
    { label: "분석 중", value: stats.processing, accent: "text-blue-600" },
    { label: "실패", value: stats.error, accent: "text-rose-600" },
  ];

  return (
    <Card className="border-border bg-card/80 shadow-xl backdrop-blur">
      <CardContent className="flex flex-col gap-6 p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-foreground">내 문서</p>
            <p className="text-xs text-muted-foreground">
              업로드한 문서의 분석 현황을 확인합니다.
            </p>
          </div>
          <span className="rounded-full border border-border bg-background px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {stats.total} docs
          </span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {tiles.map((tile) => (
            <div
              key={tile.label}
              className="rounded-xl border border-border bg-background/80 p-3 text-center"
            >
              <p className={`text-xl font-semibold ${tile.accent}`}>
                {tile.value}
              </p>
              <p className="text-[11px] text-muted-foreground">{tile.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-3 rounded-2xl border border-border bg-background/80 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="rounded-lg border border-border bg-card p-2">
                <FileText className="h-4 w-4 text-primary" />
              </span>
              <p className="text-sm font-semibold text-foreground">
                {recentDoc?.file_name ?? "아직 문서가 없습니다"}
              </p>
            </div>
            {recentDoc && (
              <span
                className={`rounded-full px-2 py-1 text-[11px] font-medium ${
                  recentDoc.status === "done"
                    ? "bg-emerald-100/70 text-emerald-800"
                    : recentDoc.status === "error"
                    ? "bg-rose-100/70 text-rose-800"
                    : "bg-amber-100/70 text-amber-800"
                }`}
              >
                {recentDoc.status === "done"
                  ? "분석 완료"
                  : recentDoc.status === "error"
                  ? "실패"
                  : "분석 중"}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {recentDoc?.summary
              ? recentDoc.summary
              : "문서를 업로드하면 AI 요약 결과가 여기에 표시됩니다."}
          </p>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {recentDoc?.created_at
                ? `최근 업로드: ${recentDoc.created_at}`
                : "아직 업로드 기록이 없습니다"}
            </p>
            <Button asChild variant="ghost" size="sm">
              <Link href="/mypage">전체 보기</Link>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
