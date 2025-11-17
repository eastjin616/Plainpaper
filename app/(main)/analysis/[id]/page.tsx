"use client";

import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { AlertTriangle, BarChart2, ListChecks } from "lucide-react";
import ProtectedPage from "@/app/_contexts/ProtectedPage";

const mockResult = {
  id: "abc123",
  summary:
    "이 문서는 암보험 상품에 대한 약관입니다. 주요 보장은 암 진단 시 5000만원 지급이며, 갑상선암은 보장 제외입니다. 보험료는 매년 갱신되어 변동될 수 있습니다.",
  description: [
    "보장 금액: 암 진단 시 5,000만원 지급",
    "보장 제외: 갑상선암",
    "보험료: 1년마다 갱신 (매년 변동 가능)",
    "만기 환급금 없음 (순수보장형 상품)",
  ],
  highlights: [
    "⚠️ 갑상선암은 보장 제외 항목입니다.",
    "⚠️ 비급여 항목 진료 시 보장 제외 가능성이 있습니다.",
  ],
  metrics: {
    readability: 78,
    reliability: 85,
    risk: 65,
  },
};

export default function AnalysisResultPage() {
  const router = useRouter();
  const params = useParams();
  const [data, setData] = useState<typeof mockResult | null>(null);
  const [isOpen, setIsOpen] = useState(false); // ✅ 모달 상태
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    setData(mockResult);
  }, [params.id]);

  const handleSubmit = () => {
    console.log("평가 제출:", { rating, comment });
    setIsOpen(false);
    setRating(0);
    setComment("");
    alert("평가가 제출되었습니다! ✅");
  };

  if (!data)
    return <p className="text-center mt-20">분석 결과를 불러오는 중...</p>;

  return (
    <ProtectedPage>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 p-8">
        <div className="max-w-3xl w-full space-y-8">
          {/* 📄 분석 요약 결과 */}
          <Card className="shadow-lg border border-zinc-200 bg-white/80 backdrop-blur">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-4 text-zinc-900">
                📄 분석 요약 결과
              </h1>
              <p className="text-zinc-700 leading-relaxed">{data.summary}</p>
            </CardContent>
          </Card>

          {/* ✅ 핵심 내용 요약 */}
          <Card className="shadow-md border border-zinc-200 bg-white/80">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-zinc-600" /> 핵심 내용 요약
              </h2>
              <ul className="list-disc ml-6 text-zinc-700 space-y-2">
                {data.description.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* ⚠️ 주의 문장 */}
          <Card className="shadow-md border border-zinc-200 bg-white/80">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> 주의해야 할 문장
              </h2>
              <ul className="list-disc ml-6 text-zinc-700 space-y-2">
                {data.highlights.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 📊 분석 지표 */}
          <Card className="shadow-md border border-zinc-200 bg-white/80">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-zinc-900 mb-4">
                <BarChart2 className="w-5 h-5 text-zinc-700" /> 분석 지표
              </h2>
              <div className="space-y-4">
                {[
                  { label: "가독성", value: data.metrics.readability },
                  { label: "신뢰도", value: data.metrics.reliability },
                  { label: "위험도", value: data.metrics.risk },
                ].map((metric) => (
                  <div key={metric.label}>
                    <div className="flex justify-between text-sm text-zinc-700 mb-1">
                      <span>{metric.label}</span>
                      <span>{metric.value}%</span>
                    </div>
                    <div className="w-full h-3 bg-zinc-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          metric.label === "위험도"
                            ? "bg-red-400"
                            : "bg-green-400"
                        }`}
                        style={{ width: `${metric.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ✅ 다시 업로드 / 평가하기 버튼 */}
          <div className="flex justify-center gap-4">
            <Button
              className="mt-6 text-lg px-8"
              onClick={() => router.push("/upload")}
            >
              다시 업로드하기
            </Button>
            <Button
              className="mt-6 text-lg px-8 bg-blue-600 hover:bg-blue-700"
              onClick={() => setIsOpen(true)} // ✅ 모달 열기
            >
              평가하기
            </Button>
          </div>
        </div>

        {/* ✅ 평가 모달 */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>AI 분석 결과 평가하기</DialogTitle>
              <DialogDescription>
                서비스 품질 향상을 위해 평가를 남겨주세요 😊
              </DialogDescription>
            </DialogHeader>

            {/* 별점 선택 */}
            <div className="flex justify-center my-4">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setRating(num)}
                  className={`text-3xl transition ${
                    rating >= num ? "text-yellow-400" : "text-zinc-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* 코멘트 입력 */}
            <Textarea
              placeholder="분석 결과에 대한 의견을 남겨주세요"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                취소
              </Button>
              <Button onClick={handleSubmit}>제출하기</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </ProtectedPage>
  );
}