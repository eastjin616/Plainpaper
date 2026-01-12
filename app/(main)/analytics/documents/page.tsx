"use client";

import { Card, CardContent } from "@/components/ui/card";
import DonutChart from "@/components/analytics/DonutChart";

const riskSegments = [
  { label: "High", value: 24, color: "#ef4444" },
  { label: "Medium", value: 46, color: "#f59e0b" },
  { label: "Low", value: 30, color: "#22c55e" },
];

const documentTypes = [
  { label: "계약서", value: 36, color: "bg-sky-500" },
  { label: "정책 문서", value: 24, color: "bg-blue-500" },
  { label: "리포트", value: 16, color: "bg-emerald-500" },
  { label: "가이드", value: 14, color: "bg-amber-500" },
  { label: "기타", value: 10, color: "bg-slate-400" },
];

const riskDocuments = [
  { name: "B2B 계약서 2024", type: "계약서", score: 92 },
  { name: "개인정보 처리방침", type: "정책 문서", score: 88 },
  { name: "서비스 SLA 초안", type: "계약서", score: 84 },
  { name: "금융 리스크 리포트", type: "리포트", score: 79 },
  { name: "파트너 약관 업데이트", type: "계약서", score: 76 },
];

const mostViewed = [
  { name: "고객 온보딩 가이드", type: "가이드", views: 1280 },
  { name: "프로덕트 정책 요약", type: "정책 문서", views: 980 },
  { name: "조직 보안 표준", type: "리포트", views: 860 },
  { name: "SLA 핵심 조항", type: "계약서", views: 740 },
  { name: "법무 체크리스트", type: "기타", views: 620 },
];

export default function DocumentsAnalyticsPage() {
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

        <Card className="border-border bg-card/80 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">위험도 분포</h2>
              <p className="text-sm text-muted-foreground">
                문서 리스크 수준을 한눈에 살펴봅니다.
              </p>
            </div>
            <DonutChart segments={riskSegments} />
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
            <div className="flex flex-col gap-4">
              {riskDocuments.map((doc) => (
                <div
                  key={doc.name}
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
          </CardContent>
        </Card>

        <Card className="border-border bg-card/80 shadow-md">
          <CardContent className="flex flex-col gap-6 p-6">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                많이 조회된 문서 Top
              </h2>
              <p className="text-sm text-muted-foreground">
                최근 문서 조회 패턴을 확인합니다.
              </p>
            </div>
            <div className="flex flex-col gap-4">
              {mostViewed.map((doc) => (
                <div
                  key={doc.name}
                  className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-foreground">{doc.name}</p>
                    <p className="text-xs text-muted-foreground">{doc.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {doc.views.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">Views</p>
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
