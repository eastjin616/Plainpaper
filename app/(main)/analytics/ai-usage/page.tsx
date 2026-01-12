"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LineChart from "@/components/analytics/LineChart";

type Period = "7d" | "30d";

const agentSummary = [
  { label: "Summary", value: 1420, color: "bg-sky-500" },
  { label: "Risk", value: 860, color: "bg-blue-600" },
  { label: "Q&A", value: 1140, color: "bg-indigo-500" },
];

const trendSeries = [
  { key: "usage", label: "AI 사용량", color: "#2563eb" },
];

const trendData: Record<Period, Record<string, number | string>[]> = {
  "7d": [
    { label: "Mon", usage: 180 },
    { label: "Tue", usage: 220 },
    { label: "Wed", usage: 260 },
    { label: "Thu", usage: 210 },
    { label: "Fri", usage: 310 },
    { label: "Sat", usage: 240 },
    { label: "Sun", usage: 290 },
  ],
  "30d": [
    { label: "1W", usage: 860 },
    { label: "2W", usage: 1020 },
    { label: "3W", usage: 1180 },
    { label: "4W", usage: 1320 },
  ],
};

const userUsage = [
  { name: "김소연", role: "Admin", calls: 320 },
  { name: "박지훈", role: "Editor", calls: 280 },
  { name: "이민호", role: "Viewer", calls: 240 },
  { name: "정하나", role: "Editor", calls: 210 },
  { name: "오지은", role: "Viewer", calls: 180 },
];

export default function AiUsageAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7d");
  const data = useMemo(() => trendData[period], [period]);
  const maxCalls = Math.max(...userUsage.map((user) => user.calls), 1);

  return (
    <>
      <section className="grid gap-4 md:grid-cols-3">
        {agentSummary.map((agent) => (
          <Card key={agent.label} className="border-border bg-card/80 shadow-md">
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{agent.label}</p>
                <span className={`h-2.5 w-2.5 rounded-full ${agent.color}`} />
              </div>
              <p className="text-2xl font-semibold text-foreground">
                {agent.value.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">지난 7일 기준 호출 수</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section>
        <Card className="border-border bg-card/80 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">AI 사용량 추이</h2>
                <p className="text-sm text-muted-foreground">
                  에이전트 호출 건수를 기간별로 비교합니다.
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
              <div className="text-xs text-muted-foreground">
                일간 AI 호출 수 합산
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-border bg-card/80 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                사용자별 AI 호출 수
              </h2>
              <p className="text-sm text-muted-foreground">
                워크스페이스 사용자별 AI 활용도를 확인합니다.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {userUsage.map((user) => (
                <div
                  key={user.name}
                  className="flex flex-col gap-2 rounded-xl border border-border bg-background px-4 py-3"
                >
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.role}</p>
                    </div>
                    <span className="text-sm font-semibold text-foreground">
                      {user.calls}
                    </span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-blue-500"
                      style={{ width: `${(user.calls / maxCalls) * 100}%` }}
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
