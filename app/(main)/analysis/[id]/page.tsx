"use client";

import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import {
  Gauge,
  ListChecks,
  Sparkles,
  FileText,
  ArrowLeft,
  Wand2,
} from "lucide-react";

import ProtectedPage from "@/app/_contexts/ProtectedPage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type AtsData = {
  status?: string;
  ats_score: number;
  ats_points: string[];
  scores: {
    contact: number;
    sections: number;
    impact: number;
    skills: number;
    readability: number;
  };
  keywords: string[];
  sections_found: string[];
  resume_length: number;
};

const SCORE_LABELS: Record<string, { label: string; icon: string }> = {
  contact: { label: "연락처", icon: "📞" },
  sections: { label: "섹션 구성", icon: "📑" },
  impact: { label: "성과 구체성", icon: "📈" },
  skills: { label: "스킬 키워드", icon: "🛠️" },
  readability: { label: "가독성", icon: "📖" },
};

export default function AnalysisResultPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [data, setData] = useState<AtsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResult() {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${API_URL}/resume/${documentId}/ats`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });

        const json = await res.json();

        if (json.status !== "done") {
          setData(null);
          return;
        }

        setData(json);
      } catch (err) {
        console.error("🔥 fetch 실패:", err);
        setData(null);
      } finally {
        setLoading(false);
      }
    }

    fetchResult();
  }, [documentId]);

  if (loading) {
    return (
      <ProtectedPage>
        <main className="flex items-center justify-center min-h-screen text-muted-foreground">
          ATS 분석 결과 불러오는 중...
        </main>
      </ProtectedPage>
    );
  }

  if (!data) {
    return (
      <ProtectedPage>
        <main className="flex items-center justify-center min-h-screen text-muted-foreground">
          분석이 아직 완료되지 않았습니다.
        </main>
      </ProtectedPage>
    );
  }

  const scoreColor = (v: number) =>
    v >= 80 ? "text-emerald-600" : v >= 50 ? "text-amber-600" : "text-rose-600";
  const barColor = (v: number) =>
    v >= 80 ? "bg-emerald-500" : v >= 50 ? "bg-amber-500" : "bg-rose-500";

  return (
    <ProtectedPage>
      <main className="min-h-screen bg-background px-6 py-10">
        <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
          <button
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => router.push("/mypage")}
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </button>

          <div className="flex gap-3 items-center">
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => router.push(`/analysis/loading/${documentId}`)}
            >
              <Wand2 className="w-4 h-4 mr-1" />
              자소서 첨삭 시작
            </Button>
          </div>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">
          {/* ATS 점수 히어로 */}
          <Card className="shadow-md border-border bg-card/80 backdrop-blur">
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative w-40 h-40 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle
                      cx="50" cy="50" r="42"
                      className="fill-none stroke-muted"
                      strokeWidth="10"
                    />
                    <circle
                      cx="50" cy="50" r="42"
                      className={`fill-none ${barColor(data.ats_score)}`}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${data.ats_score * 2.64} 264`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`text-4xl font-black ${scoreColor(data.ats_score)}`}>
                      {data.ats_score}
                    </span>
                    <span className="text-xs text-muted-foreground">/ 100</span>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-2xl font-bold mb-2 text-foreground flex items-center justify-center md:justify-start gap-2">
                    <Gauge className="w-6 h-6 text-primary" />
                    ATS 합격률 점수
                  </h1>
                  <p className="text-muted-foreground leading-relaxed">
                    이력서가 자동 서류심사(ATS) 시스템에서 얼마나 잘 파싱될 수 있는지 평가했어요.
                    {data.ats_score >= 80
                      ? " 훌륭한 이력서입니다! 🎉"
                      : data.ats_score >= 50
                      ? " 개선하면 합격률이 크게 올라갑니다."
                      : " 아래 개선 포인트를 반영하면 큰 향상이 기대돼요."}
                  </p>

                  {data.keywords.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
                      {data.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 카테고리 스코어 */}
          <Card className="shadow-md border-border bg-card/80">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-muted-foreground" />
                세부 평가
              </h2>

              <div className="space-y-5">
                {Object.entries(SCORE_LABELS).map(([key, meta]) => {
                  const value = data.scores[key as keyof AtsData["scores"]] ?? 0;
                  return (
                    <div key={key}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-card-foreground">
                          {meta.icon} {meta.label}
                        </span>
                        <span className={scoreColor(value)}>{value} / 20</span>
                      </div>
                      <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${barColor(value)} transition-all duration-700`}
                          style={{ width: `${(value / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* 개선 포인트 */}
          <Card className="shadow-md border-border bg-card/80">
            <CardContent className="p-8">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-muted-foreground" />
                개선 포인트
              </h2>
              <ul className="space-y-3">
                {data.ats_points.map((point, i) => (
                  <li
                    key={i}
                    className="flex gap-3 text-card-foreground leading-relaxed p-3 rounded-lg bg-muted/50"
                  >
                    <span className="text-primary font-bold shrink-0">{i + 1}.</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-sm text-card-foreground">
                💡 <strong>팁:</strong> ATS는 특수문자·표·이미지보다{" "}
                <span className="font-medium">평문 텍스트 구조</span>를 잘 파싱해요.
                표 대신 섹션 제목 + 목록 형태로 작성하면 점수가 올라갑니다.
              </div>
            </CardContent>
          </Card>

          {/* 원문 확인 */}
          <Card className="shadow-md border-border bg-card/80">
            <CardContent className="p-8 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-muted-foreground" />
                <div>
                  <p className="font-medium text-foreground">업로드한 이력서 원문</p>
                  <p className="text-sm text-muted-foreground">
                    총 {data.resume_length.toLocaleString()}자 ·{" "}
                    {data.sections_found.length > 0
                      ? data.sections_found.slice(0, 6).join(", ")
                      : "섹션 미발견"}
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={async () => {
                  const token = localStorage.getItem("token");
                  const res = await fetch(`${API_URL}/files/${documentId}/pdf`, {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                  });
                  if (!res.ok) {
                    alert("PDF를 가져올 수 없습니다.");
                    return;
                  }
                  const blob = await res.blob();
                  window.open(URL.createObjectURL(blob), "_blank");
                }}
              >
                PDF 원문 보기
              </Button>
            </CardContent>
          </Card>

          {/* CTA */}
          <div className="flex justify-center gap-4 pt-4">
            <Button
              className="px-8 py-3 text-lg bg-background border border-border text-foreground hover:bg-accent"
              onClick={() => router.push("/upload")}
            >
              이력서 다시 업로드
            </Button>
            <Button
              className="px-8 py-3 text-lg bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push("/mypage")}
            >
              내 문서 보기
            </Button>
          </div>
        </div>
      </main>
    </ProtectedPage>
  );
}
