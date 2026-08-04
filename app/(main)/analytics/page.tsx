"use client";

import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  FileText,
  MessageSquareText,
  ShieldAlert,
  Sparkles,
  Users,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import LineChart from "@/components/analytics/LineChart";
import DonutChart from "@/components/analytics/DonutChart";
import { useAnalytics } from "@/components/analytics/use-analytics";
import { Button } from "@/components/ui/button";
import type { AnalyticsOverview, AnalyticsTrend } from "@/app/_types/analytics";

type Period = "7d" | "30d";

const kpiIcons: Record<string, typeof FileText> = {
  documents: FileText,
  risk: ShieldAlert,
  ai: Sparkles,
  questions: MessageSquareText,
  users: Users,
};

const trendSeries = [
  { key: "documents", label: "문서 업로드", color: "#1d4ed8" },
  { key: "ai", label: "AI 사용량", color: "#0ea5e9" },
  { key: "questions", label: "질문 수", color: "#38bdf8" },
];

const trendRows = (trend: AnalyticsTrend) =>
  trend.labels.map((label, i) => ({
    label,
    documents: trend.documents[i] ?? 0,
    ai: trend.ai[i] ?? 0,
    questions: trend.questions[i] ?? 0,
  }));

export default function AnalyticsOverviewPage() {
  const [period, setPeriod] = useState<Period>("7d");
  const { data, loading, error, reload } = useAnalytics<AnalyticsOverview>(
    "/analytics/overview"
  );

  const trendData = useMemo(
    () => (data ? trendRows(data.trend[period]) : []),
    [data, period]
  );

  if (loading) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        데이터를 불러오는 중입니다...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-destructive">{error ?? "데이터를 불러오지 못했습니다."}</p>
        <Button variant="outline" onClick={reload}>
          다시 시도
        </Button>
      </div>
    );
  }

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {data.kpis.map((item) => {
          const Icon = kpiIcons[item.key] ?? FileText;
          const isPositive = item.delta >= 0;
          return (
            <Card key={item.key} className="border-border bg-card/80 shadow-md">
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {item.value.toLocaleString()}
                    </p>
                  </div>
                  <span className="rounded-2xl border border-border bg-background p-2">
                    <Icon className="h-4 w-4 text-primary" />
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1 text-xs font-medium ${
                    isPositive ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {item.delta !== 0 ? (
                    <>
                      {isPositive ? (
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      ) : (
                        <ArrowDownRight className="h-3.5 w-3.5" />
                      )}
                      {Math.abs(item.delta)}% 지난 기간 대비
                    </>
                  ) : (
                    <span className="text-muted-foreground">데이터 충분하지 않음</span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section>
        <Card className="border-border bg-card/80 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  문서 및 AI 사용 추이
                </h2>
                <p className="text-sm text-muted-foreground">
                  문서 업로드와 AI 활용 흐름을 함께 추적합니다.
                </p>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-border bg-background p-1 text-xs">
                {(["7d", "30d"] as Period[]).map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPeriod(value)}
                    className={`rounded-full px-4 py-2 font-medium transition ${
                      period === value
                        ? "bg-primary text-primary-foreground shadow"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {value === "7d" ? "7일" : "30일"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="h-52 w-full">
                <LineChart data={trendData} series={trendSeries} />
              </div>
              <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                {trendSeries.map((series) => (
                  <div key={series.key} className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: series.color }}
                    />
                    {series.label}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card/80 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">위험도 분포</h2>
              <p className="text-sm text-muted-foreground">
                전체 문서의 위험도 수준을 구간별로 나눴습니다.
              </p>
            </div>
            {data.risk.every((segment) => segment.value === 0) ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                위험도 분석 결과가 아직 없습니다. 문서를 분석하면 여기에 표시됩니다.
              </p>
            ) : (
              <DonutChart segments={data.risk} />
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                문서 유형 분포
              </h2>
              <p className="text-sm text-muted-foreground">
                워크스페이스 내 문서 유형을 비교합니다.
              </p>
            </div>
            {data.types.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                업로드된 문서가 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {data.types.map((type) => (
                  <div key={type.label} className="flex flex-col gap-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-foreground">{type.label}</span>
                      <span className="text-muted-foreground">
                        {type.value}건
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className={`h-2 rounded-full ${type.color}`}
                        style={{
                          width: `${Math.max(
                            4,
                            (type.value /
                              Math.max(
                                1,
                                data.types.reduce((sum, t) => sum + t.value, 0)
                              )) *
                              100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  );
}
