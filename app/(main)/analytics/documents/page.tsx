"use client";

import { Card, CardContent } from "@/components/ui/card";
import DonutChart from "@/components/analytics/DonutChart";
import { useAnalytics } from "@/components/analytics/use-analytics";
import { Button } from "@/components/ui/button";
import type { AnalyticsDocuments } from "@/app/_types/analytics";

const statusLabels: Record<string, string> = {
  active: "분석 완료",
  processing: "분석 중",
  failed: "실패",
};

export default function DocumentsAnalyticsPage() {
  const { data, loading, error, reload } = useAnalytics<AnalyticsDocuments>(
    "/analytics/documents"
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
      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card/80 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">문서 유형 분포</h2>
              <p className="text-sm text-muted-foreground">
                업로드된 문서 유형별 비율을 확인하세요.
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

        <Card className="border-border bg-card/80 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">위험도 분포</h2>
              <p className="text-sm text-muted-foreground">
                문서 리스크 수준을 한눈에 살펴봅니다.
              </p>
            </div>
            {data.risk.every((segment) => segment.value === 0) ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                위험도 분석 결과가 아직 없습니다.
              </p>
            ) : (
              <DonutChart segments={data.risk} />
            )}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card/80 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                위험도 Top 문서
              </h2>
              <p className="text-sm text-muted-foreground">
                위험 점수가 높은 문서를 우선적으로 관리합니다.
              </p>
            </div>
            {data.risky.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                위험도 분석 결과가 아직 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {data.risky.map((doc) => (
                  <div
                    key={`${doc.name}-${doc.score}`}
                    className="flex flex-col gap-2 rounded-xl border border-border bg-background px-4 py-3"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div>
                        <p className="font-medium text-foreground">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type}</p>
                      </div>
                      <span className="text-sm font-semibold text-rose-600">
                        {doc.score}
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-rose-500"
                        style={{ width: `${doc.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                최근 업로드 문서
              </h2>
              <p className="text-sm text-muted-foreground">
                가장 최근에 업로드된 문서를 확인합니다.
              </p>
            </div>
            {data.recent.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                업로드된 문서가 없습니다.
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {data.recent.map((doc) => (
                  <div
                    key={`${doc.name}-${doc.uploadedAt}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm"
                  >
                    <div>
                      <p className="font-medium text-foreground">{doc.name}</p>
                      <p className="text-xs text-muted-foreground">{doc.type}</p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                          doc.status === "active"
                            ? "bg-emerald-100/70 text-emerald-800"
                            : "bg-amber-100/70 text-amber-800"
                        }`}
                      >
                        {statusLabels[doc.status] ?? doc.status}
                      </span>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {doc.uploadedAt
                          ? new Date(doc.uploadedAt).toLocaleDateString("ko-KR")
                          : ""}
                      </p>
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
