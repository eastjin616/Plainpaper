"use client";

import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LineChart from "@/components/analytics/LineChart";
import { useAnalytics } from "@/components/analytics/use-analytics";
import { Button } from "@/components/ui/button";
import type { AnalyticsAiUsage } from "@/app/_types/analytics";

type Period = "7d" | "30d";

const trendSeries = [{ key: "usage", label: "AI 사용량", color: "#2563eb" }];

export default function AiUsageAnalyticsPage() {
  const [period, setPeriod] = useState<Period>("7d");
  const { data, loading, error, reload } = useAnalytics<AnalyticsAiUsage>(
    "/analytics/ai-usage"
  );

  const trendData = useMemo(
    () => (data ? data.trend[period] : []),
    [data, period]
  );
  const maxCalls = Math.max(...(data?.users.map((user) => user.calls) ?? []), 1);

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
      <section className="grid gap-4 md:grid-cols-4">
        {data.agentSummary.map((agent) => (
          <Card key={agent.label} className="border-border bg-card/80 shadow-md">
            <CardContent className="flex flex-col gap-4 p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{agent.label}</p>
                <span className={`h-2.5 w-2.5 rounded-full ${agent.color}`} />
              </div>
              <p className="text-2xl font-semibold text-foreground">
                {agent.value.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">누적 호출 수</p>
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
                <LineChart data={trendData} series={trendSeries} />
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
            {data.users.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                사용자 데이터가 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {data.users.map((user) => (
                  <div
                    key={user.name}
                    className="flex flex-col gap-2 rounded-xl border border-border bg-background px-4 py-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-foreground">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.role} · 업로드 {user.uploads}건
                        </p>
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
            )}
          </CardContent>
        </Card>
      </section>

      <section>
        <Card className="border-border bg-card/80 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">AI 모델 목록</h2>
              <p className="text-sm text-muted-foreground">
                서비스에 등록된 AI 모델 정보입니다.
              </p>
            </div>
            {data.models.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                등록된 AI 모델이 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {data.models.map((model) => (
                  <div
                    key={`${model.name}-${model.version}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-foreground">{model.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {model.description || model.provider}
                      </p>
                    </div>
                    <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                      {model.provider}
                      {model.version ? ` · ${model.version}` : ""}
                    </span>
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
