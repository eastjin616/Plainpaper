"use client";

import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

import {
  AlertTriangle,
  BarChart2,
  ListChecks,
  FileText,
  ArrowLeft,
} from "lucide-react";

import ProtectedPage from "@/app/_contexts/ProtectedPage";
import ChatSidebar from "@/components/layout/ChatSidebar";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AnalysisResultPage() {
  const router = useRouter();
  const params = useParams();
  const documentId = params.id as string;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    // Submit logic here
    console.log("Rating:", rating);
    console.log("Comment:", comment);
    setIsOpen(false);
  };

  useEffect(() => {
    async function fetchResult() {
      try {
        const res = await fetch(`${API_URL}/analysis/${documentId}`, {
          cache: "no-store",
        });

        const json = await res.json();
        console.log("📌 분석 결과 응답:", json);

        if (json.status !== "done") {
          setData(null);
          return;
        }

        setData({
          summary: json.summary ?? "",
          description: json.description ?? [],
          highlights: json.highlights ?? [],
          metrics: json.metrics ?? {},
        });
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
        <main className="flex items-center justify-center min-h-screen text-zinc-500">
          분석 결과 불러오는 중...
        </main>
      </ProtectedPage>
    );
  }

  if (!data) {
    return (
      <ProtectedPage>
        <main className="flex items-center justify-center min-h-screen text-zinc-500">
          분석이 아직 완료되지 않았습니다.
        </main>
      </ProtectedPage>
    );
  }

  return (
    <ProtectedPage>
      <main className="min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 px-6 py-10">

        {/* 🔥 상단 액션바 */}
        <div className="max-w-5xl mx-auto flex justify-between items-center mb-8">
          <button
            className="flex items-center gap-2 text-zinc-600 hover:text-zinc-800"
            onClick={() => router.push("/mypage")}
          >
            <ArrowLeft className="w-4 h-4" />
            뒤로가기
          </button>

          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={async () => {
                const token = localStorage.getItem("token");
                const res = await fetch(`${API_URL}/files/${documentId}/pdf`, {
                  headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                  alert("PDF를 가져올 수 없습니다.");
                  return;
                }

                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                window.open(url, "_blank");
              }}
            >
              PDF 원문 보기
            </Button>

            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setIsChatOpen(true)}
            >
              AI 질문하기
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] max-w-5xl mx-auto gap-10">

          {/* ---------- 📄 좌측: 분석 정보 ---------- */}
          <div className="space-y-8">

            {/* Summary */}
            <Card className="shadow-md border border-zinc-200 bg-white/80 backdrop-blur">
              <CardContent className="p-8">
                <h1 className="text-2xl font-bold mb-4 text-zinc-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-zinc-600" />
                  문서 요약
                </h1>
                <p className="text-zinc-700 leading-relaxed whitespace-pre-line">
                  {data.summary}
                </p>
              </CardContent>
            </Card>

            {/* 핵심 내용 */}
            <Card className="shadow-md border border-zinc-200 bg-white/80">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                  <ListChecks className="w-5 h-5 text-zinc-600" />
                  핵심 내용 요약
                </h2>
                <ul className="space-y-2 text-zinc-700">
                  {data.description.map((desc: string, i: number) => (
                    <li key={i} className="leading-relaxed">
                      • {desc}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 주의 문장 */}
            <Card className="shadow-md border border-zinc-200 bg-white/80">
              <CardContent className="p-8">
                <h2 className="text-xl font-semibold text-red-600 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  주의해야 할 문장
                </h2>
                <ul className="space-y-2 text-zinc-700">
                  {data.highlights.map((item: string, i: number) => (
                    <li key={i}>⚠️ {item}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* 분석 지표 */}
            {data.metrics && (
              <Card className="shadow-md border border-zinc-200 bg-white/80">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold flex items-center gap-2 text-zinc-900 mb-4">
                    <BarChart2 className="w-5 h-5 text-zinc-600" />
                    분석 지표
                  </h2>

                  <div className="space-y-5">
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
                                : "bg-purple-500"
                            }`}
                            style={{ width: `${metric.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* ----------- 🤖 우측: 챗봇 사이드바 ----------- */}
          <div className="">
            <ChatSidebar
              open={isChatOpen}
              onOpenChange={setIsChatOpen}
              document_id={documentId}
            />
          </div>
        </div>
        {/* 🔻 하단 액션 버튼 섹션 */}
          <div className="max-w-5xl mx-auto flex justify-center gap-4 mt-12">
            {/* 다시 업로드하기 */}
            <Button
              className="px-8 py-3 text-lg bg-white border border-zinc-300 text-zinc-900 hover:bg-zinc-100"
              onClick={() => router.push("/upload")}
            >
              다시 업로드하기
            </Button>

            {/* 평가하기 */}
            <Button
              className="px-8 py-3 text-lg bg-purple-600 text-white hover:bg-purple-700"
              onClick={() => setIsOpen(true)}
            >
              평가하기
            </Button>
          </div>
      </main>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[450px] rounded-xl shadow-2xl border border-zinc-200 bg-white/90 backdrop-blur-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-zinc-900">
              분석 결과 평가하기
            </DialogTitle>
            <DialogDescription className="text-zinc-600">
              서비스 품질 향상을 위해 의견을 남겨주세요 😊
            </DialogDescription>
          </DialogHeader>

          {/* ⭐ 별점 선택 */}
          <div className="flex justify-center my-4">
            {[1,2,3,4,5].map((num) => (
              <button
                key={num}
                onClick={() => setRating(num)}
                className={`text-4xl transition-all ${
                  rating >= num ? "text-yellow-400 scale-110" : "text-zinc-300"
                }`}
              >
                ★
              </button>
            ))}
          </div>

          {/* 의견 입력 */}
          <Textarea
            placeholder="분석 결과에 대한 의견을 남겨주세요"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="h-28 resize-none bg-white/60"
          />

          <DialogFooter className="mt-4 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="px-5"
            >
              취소
            </Button>

            <Button
              onClick={handleSubmit}
              className="px-5 bg-purple-600 text-white hover:bg-purple-700"
            >
              제출하기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </ProtectedPage>
  );
}