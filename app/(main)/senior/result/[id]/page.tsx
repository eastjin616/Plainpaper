"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedPage from "@/app/_contexts/ProtectedPage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, RotateCcw, Sparkles, Home } from "lucide-react";
import type { SeniorResult } from "@/app/_types/senior";
import { API_URL, authHeaders, getErrorMessage } from "@/lib/api";

const GRADE_COLOR: Record<string, string> = {
  A: "text-green-600 border-green-500 bg-green-50",
  B: "text-blue-600 border-blue-500 bg-blue-50",
  C: "text-amber-600 border-amber-500 bg-amber-50",
  D: "text-red-600 border-red-500 bg-red-50",
};

const DOMAIN_META = [
  { key: "financial", label: "재무", max: 60, color: "bg-blue-500" },
  { key: "health", label: "건강", max: 20, color: "bg-green-500" },
  { key: "leisure", label: "여가", max: 10, color: "bg-purple-500" },
  { key: "relationship", label: "대인관계", max: 10, color: "bg-orange-500" },
];

const GRADE_MESSAGE: Record<string, string> = {
  A: "노후 준비가 매우 잘 되어 있어요. 지금처럼 꾸준히 관리하세요!",
  B: "전반적으로 잘 준비되어 있어요. 부족한 영역만 보완하면 좋아요.",
  C: "아직 개선할 여지가 많아요. 하나씩 차근차근 보완해보세요.",
  D: "노후 준비가 부족한 상태예요. 지금부터라도 시작하는 것이 중요해요.",
};

export default function SeniorResultPage() {
  const router = useRouter();
  const params = useParams();
  const resultId = params.id as string;

  const [result, setResult] = useState<SeniorResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/senior/history/${resultId}`, { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error("결과를 불러오지 못했습니다.");
        return res.json();
      })
      .then((json) => {
        setResult(json);
        setLoading(false);
      })
      .catch((e) => {
        setError(getErrorMessage(e, "결과를 불러오지 못했습니다."));
        setLoading(false);
      });
  }, [resultId]);

  if (loading) {
    return (
      <ProtectedPage>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ProtectedPage>
    );
  }

  if (error || !result) {
    return (
      <ProtectedPage>
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
          <p className="text-lg font-medium text-foreground">
            {error ?? "결과를 찾을 수 없습니다."}
          </p>
          <Button onClick={() => router.push("/senior")}>
            <Home className="mr-2 h-4 w-4" /> 진단 홈으로
          </Button>
        </div>
      </ProtectedPage>
    );
  }

  const score = Math.min(100, Math.max(0, result.score));
  const ringAngle = (score / 100) * 360;

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          {/* 헤더 */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {result.created_at} 진단 결과
            </p>
            <h1 className="mt-1 text-3xl font-bold text-foreground">
              노후 준비 점수
            </h1>
          </div>

          {/* 점수 링 + 등급 */}
          <div className="mt-8 flex items-center justify-center gap-8">
            <div
              className="relative h-44 w-44 rounded-full"
              style={{
                background: `conic-gradient(var(--primary) ${ringAngle}deg, hsl(var(--muted)) 0deg)`,
              }}
            >
              <div className="absolute inset-3 flex flex-col items-center justify-center rounded-full bg-background">
                <span className="text-5xl font-extrabold text-foreground">
                  {score}
                </span>
                <span className="text-sm text-muted-foreground">/ 100점</span>
              </div>
            </div>
            <div className="text-left">
              <span
                className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl border-2 text-5xl font-extrabold ${GRADE_COLOR[result.grade] ?? GRADE_COLOR.D}`}
              >
                {result.grade}
              </span>
              <p className="mt-2 max-w-[180px] text-sm font-medium text-foreground">
                {GRADE_MESSAGE[result.grade] ?? ""}
              </p>
            </div>
          </div>

          {/* 영역별 점수 */}
          <Card className="mt-8">
            <CardContent className="space-y-5 p-6">
              <h2 className="text-lg font-semibold text-foreground">
                영역별 진단
              </h2>
              {DOMAIN_META.map((d) => {
                const val = result.domains?.[d.key as keyof typeof result.domains] ?? 0;
                return (
                  <div key={d.key}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">
                        {d.label}
                      </span>
                      <span className="text-muted-foreground">
                        {val} / {d.max}점
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-3 rounded-full ${d.color} transition-all duration-700`}
                        style={{ width: `${(val / d.max) * 100}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* 자산 구성 */}
          <Card className="mt-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-semibold text-foreground">
                자산 구성 비율
              </h2>
              <div className="mt-4 flex h-5 w-full overflow-hidden rounded-full">
                <div
                  className="bg-blue-500"
                  style={{ width: `${result.assetMix?.realEstate ?? 0}%` }}
                />
                <div
                  className="bg-green-500"
                  style={{ width: `${result.assetMix?.financial ?? 0}%` }}
                />
                <div
                  className="bg-purple-500"
                  style={{ width: `${result.assetMix?.pension ?? 0}%` }}
                />
              </div>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-3 w-3 rounded-full bg-blue-500" /> 부동산{" "}
                  {result.assetMix?.realEstate ?? 0}%
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-3 w-3 rounded-full bg-green-500" /> 금융{" "}
                  {result.assetMix?.financial ?? 0}%
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-3 w-3 rounded-full bg-purple-500" /> 연금{" "}
                  {result.assetMix?.pension ?? 0}%
                </span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                ※ 연금은 예상 월 수령액 × 12 × 15년으로 추정한 가치입니다.
              </p>
            </CardContent>
          </Card>

          {/* AI 조언 */}
          {result.advice && (
            <Card className="mt-6 border-primary/30">
              <CardContent className="p-6">
                <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <Sparkles className="h-5 w-5 text-primary" /> AI 맞춤 조언
                </h2>
                <p className="whitespace-pre-line text-[15px] leading-relaxed text-foreground/90">
                  {result.advice}
                </p>
              </CardContent>
            </Card>
          )}

          {/* 액션 버튼 */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1"
              onClick={() => router.push("/senior/survey")}
            >
              <RotateCcw className="mr-2 h-4 w-4" /> 다시 진단하기
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.push("/senior")}
            >
              <Home className="mr-2 h-4 w-4" /> 진단 홈
            </Button>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
