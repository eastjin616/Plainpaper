"use client";

import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { AlertTriangle, BarChart2, ListChecks } from "lucide-react";
import ProtectedPage from "@/app/_contexts/ProtectedPage";
import ChatSidebar from "@/components/layout/ChatSidebar";

// 🚀 백엔드 API URL
// const API_URL = "http://localhost:8000";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function AnalysisResultPage() {
  const router = useRouter();
  const params = useParams();
  const analysisId = params.id as string;
  const document_id = analysisId;

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const [isChatOpen ,setIsChatOpen] = useState(false);



  // 📌 실제 API 호출
useEffect(() => {
  console.log("📌 페이지에서 받은 params.id:", analysisId);

  async function fetchResult() {
    try {
      // 반드시 이 경로!
      const res = await fetch(`${API_URL}/analysis/${analysisId}`, {
        cache: "no-store",
      });

      const json = await res.json();
      console.log("📡 API 응답:", json);

      if (json.status !== "done") {
        setData(null);
        return;
      }

      // 🔥 summary + description = 실제 데이터 사용
      // 🔥 highlights + metrics = 하드코딩
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
}, [analysisId]);

  // 🔥 1) 로딩 중인 경우
  if (loading) {
    return <p className="text-center mt-20">분석 결과를 불러오는 중...</p>;
  }

  // 🔥 2) 로딩 끝 + 데이터 없음
  if (!data) {
    return (
      <p className="text-center mt-20">
        아직 분석이 완료되지 않았습니다...
      </p>
    );
  }

  const handleSubmit = async () => {
    console.log("평가 제출:", { rating, comment });

    // 🔥 평가 API도 있으면 여기에 추가하면 됨

    setIsOpen(false);
    setRating(0);
    setComment("");
    alert("평가가 제출되었습니다! ✅");
  };

  return (
    <ProtectedPage>
      <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-zinc-50 to-zinc-100 p-8">
        
      {/* 🔥 상단 액션 버튼 바 */}
      <div className="max-w-3xl w-full flex flex-col md:flex-row md:justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold text-zinc-900">📄 분석 결과</h1>

          <div className="flex flex-wrap gap-3">
            {/* PDF 원문 보기 */}
            <Button
              variant="outline"
              onClick={async () => {
                const token = localStorage.getItem("token");

                const res = await fetch(`${API_URL}/files/${document_id}/pdf`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
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

            {/* 챗봇 */}
            <Button
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => setIsChatOpen(true)}
            >
              AI에게 질문하기
            </Button>
            <ChatSidebar
              open={isChatOpen}
              onOpenChange={setIsChatOpen}
              documentId={analysisId}
            />
          </div>
        </div>
        
        <div className="max-w-3xl w-full space-y-8">
          {/* 📄 분석 요약 결과 */}
          <Card className="shadow-lg border border-zinc-200 bg-white/80 backdrop-blur">
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-4 text-zinc-900">📄 분석 요약 결과</h1>
              <p className="text-zinc-700 leading-relaxed">{data.summary}</p>
            </CardContent>
          </Card>

          {/* 핵심 내용 */}
          <Card className="shadow-md border border-zinc-200 bg-white/80">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-zinc-800 mb-3 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-zinc-600" /> 핵심 내용 요약
              </h2>
              <ul className="list-disc ml-6 text-zinc-700 space-y-2">
                {data.description?.map((desc: string, i: number) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 주의 문장 */}
          <Card className="shadow-md border border-zinc-200 bg-white/80">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold text-red-600 mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> 주의해야 할 문장
              </h2>
              <ul className="list-disc ml-6 text-zinc-700 space-y-2">
                {data.highlights?.map((item: string, i: number) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* 분석 지표 */}
          {data.metrics && (
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
                            metric.label === "위험도" ? "bg-red-400" : "bg-green-400"
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

          <div className="flex justify-center gap-4">
            <Button className="mt-6 text-lg px-8" onClick={() => router.push("/upload")}>
              다시 업로드하기
            </Button>

            <Button
              className="mt-6 text-lg px-8 bg-white text-black border border-zinc-300 hover:bg-zinc-100"
              onClick={() => setIsOpen(true)}
            >
              평가하기
            </Button>
          </div>
        </div>

        {/* 평가 모달 */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>AI 분석 결과 평가하기</DialogTitle>
              <DialogDescription>서비스 품질 향상을 위해 평가를 남겨주세요 😊</DialogDescription>
            </DialogHeader>

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