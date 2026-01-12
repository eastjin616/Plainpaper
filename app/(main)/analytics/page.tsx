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

type Period = "7d" | "30d";

const kpiData = [
  {
    label: "총 문서 수",
    value: "1,284",
    delta: 12.4,
    trend: "up",
    icon: FileText,
  },
  {
    label: "평균 위험도",
    value: "42.6",
    delta: -3.1,
    trend: "down",
    icon: ShieldAlert,
  },
  {
    label: "AI 분석 실행 수",
    value: "3,982",
    delta: 18.9,
    trend: "up",
    icon: Sparkles,
  },
  {
    label: "문서 기반 질문 수",
    value: "1,142",
    delta: 6.8,
    trend: "up",
    icon: MessageSquareText,
  },
  {
    label: "활성 사용자 수",
    value: "96",
    delta: 2.2,
    trend: "up",
    icon: Users,
  },
];

const trendSeries = [
  { key: "documents", label: "문서 업로드", color: "#1d4ed8" },
  { key: "ai", label: "AI 사용량", color: "#0ea5e9" },
  { key: "questions", label: "질문 수", color: "#38bdf8" },
];

const trendData: Record<Period, Record<string, number | string>[]> = {
  "7d": [
    { label: "Mon", documents: 18, ai: 42, questions: 20 },
    { label: "Tue", documents: 22, ai: 38, questions: 26 },
    { label: "Wed", documents: 28, ai: 55, questions: 33 },
    { label: "Thu", documents: 20, ai: 48, questions: 30 },
    { label: "Fri", documents: 34, ai: 62, questions: 40 },
    { label: "Sat", documents: 26, ai: 51, questions: 28 },
    { label: "Sun", documents: 30, ai: 58, questions: 36 },
  ],
  "30d": [
    { label: "1W", documents: 120, ai: 280, questions: 140 },
    { label: "2W", documents: 160, ai: 310, questions: 170 },
    { label: "3W", documents: 190, ai: 360, questions: 210 },
    { label: "4W", documents: 210, ai: 420, questions: 260 },
  ],
};

const riskSegments = [
  { label: "High", value: 26, color: "#ef4444" },
  { label: "Medium", value: 44, color: "#f59e0b" },
  { label: "Low", value: 30, color: "#22c55e" },
];

const documentTypes = [
  { label: "계약서", value: 38, color: "bg-sky-500" },
  { label: "정책 문서", value: 22, color: "bg-blue-500" },
  { label: "리포트", value: 18, color: "bg-emerald-500" },
  { label: "가이드", value: 12, color: "bg-amber-500" },
  { label: "기타", value: 10, color: "bg-slate-400" },
];

export default function AnalyticsOverviewPage() {
  const [period, setPeriod] = useState<Period>("7d");
  const data = useMemo(() => trendData[period], [period]);

  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpiData.map((item) => {
          const Icon = item.icon;
          const isPositive = item.delta >= 0;
          return (
            <Card key={item.label} className="border-border bg-card/80 shadow-md">
              <CardContent className="flex flex-col gap-4 p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {item.value}
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
                  {isPositive ? (
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  ) : (
                    <ArrowDownRight className="h-3.5 w-3.5" />
                  )}
                  {Math.abs(item.delta)}% 지난 기간 대비
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
                <LineChart data={data} series={trendSeries} />
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
            <DonutChart segments={riskSegments} />
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
            <div className="flex flex-col gap-4">
              {documentTypes.map((type) => (
                <div key={type.label} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-foreground">{type.label}</span>
                    <span className="text-muted-foreground">{type.value}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className={`h-2 rounded-full ${type.color}`}
                      style={{ width: `${type.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </section>
    </>
  );
}
