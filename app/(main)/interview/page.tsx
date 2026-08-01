"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Mic2, MessageSquare, Sparkles, RotateCcw } from "lucide-react";
import { useRouter } from "next/navigation";

import ProtectedPage from "@/app/_contexts/ProtectedPage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function InterviewPage() {
  const router = useRouter();
  const [documentId, setDocumentId] = useState("");
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const authHeaders = (): HeadersInit => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
  };

  const handleGenerate = async () => {
    if (!documentId.trim()) {
      alert("문서 ID를 입력해주세요 (분석 페이지 주소의 /analysis/[id] 참고).");
      return;
    }
    setLoading(true);
    setQuestions([]);
    setCurrentIndex(0);
    setFeedback("");
    setAnswer("");
    try {
      const res = await fetch(`${API_URL}/interview/questions`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ document_id: documentId }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail ?? "질문 생성에 실패했습니다.");
      }
      const json = await res.json();
      setQuestions(json.questions);
    } catch (err) {
      console.error("🔥 질문 생성 실패:", err);
      alert(err instanceof Error ? err.message : "질문 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = async () => {
    if (!answer.trim()) {
      alert("답변을 입력해주세요.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/interview/evaluate`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          question: questions[currentIndex],
          answer,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail ?? "피드백 생성에 실패했습니다.");
      }
      const json = await res.json();
      setFeedback(json.feedback);
    } catch (err) {
      console.error("🔥 피드백 실패:", err);
      alert(err instanceof Error ? err.message : "피드백 생성에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const nextQuestion = () => {
    setAnswer("");
    setFeedback("");
    setCurrentIndex((i) => Math.min(i + 1, questions.length - 1));
  };

  const restart = () => {
    setQuestions([]);
    setAnswer("");
    setFeedback("");
    setCurrentIndex(0);
  };

  return (
    <ProtectedPage>
      <main className="min-h-screen bg-background px-6 py-10">
        <div className="max-w-4xl mx-auto">
          <button
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
            onClick={() => router.push("/dashboard")}
          >
            <ArrowLeft className="w-4 h-4" />
            대시보드
          </button>

          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Mic2 className="w-8 h-8 text-primary" />
            AI 모의면접
          </h1>
          <p className="text-muted-foreground mb-8">
            내 이력서를 읽은 면접관이 질문하고, STAR 구조 피드백을 받아보세요.
          </p>

          {/* 문서 ID 입력 */}
          <Card className="shadow-md border-border bg-card/80 mb-8">
            <CardContent className="p-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="flex-1 w-full">
                <label className="text-sm text-muted-foreground mb-1 block">
                  이력서 문서 ID
                </label>
                <input
                  className="w-full px-4 py-2 rounded-lg border border-border bg-background text-foreground outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="예: 28584d85-7b85-4140-93e5-a4b40ebffca4"
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                />
              </div>
              <Button
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={handleGenerate}
                disabled={loading}
              >
                <Sparkles className="w-4 h-4 mr-1" />
                {loading ? "생성 중..." : "질문 생성"}
              </Button>
            </CardContent>
          </Card>

          {/* 질문 진행 */}
          {questions.length > 0 && (
            <div className="space-y-6">
              <Card className="shadow-md border-border bg-card/80">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-muted-foreground">
                      질문 {currentIndex + 1} / {questions.length}
                    </span>
                    <div className="flex gap-2">
                      {questions.map((_, i) => (
                        <span
                          key={i}
                          className={`w-2.5 h-2.5 rounded-full ${
                            i === currentIndex ? "bg-primary" : "bg-muted"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <h2 className="text-xl font-semibold text-foreground mb-6 flex gap-2">
                    <MessageSquare className="w-5 h-5 text-primary shrink-0 mt-1" />
                    {questions[currentIndex]}
                  </h2>

                  <Textarea
                    placeholder="답변을 작성해보세요 (상황-과제-행동-결과 구조로)"
                    className="min-h-[180px] resize-y mb-4"
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                  />

                  <div className="flex flex-wrap gap-3">
                    <Button
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                      onClick={handleEvaluate}
                      disabled={loading}
                    >
                      {loading ? "평가 중..." : "답변 평가받기"}
                    </Button>
                    {currentIndex < questions.length - 1 && (
                      <Button variant="outline" onClick={nextQuestion}>
                        다음 질문 →
                      </Button>
                    )}
                    <Button variant="ghost" onClick={restart}>
                      <RotateCcw className="w-4 h-4 mr-1" />
                      다시 시작
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {feedback && (
                <Card className="shadow-md border-emerald-500/30 bg-card/80">
                  <CardContent className="p-6 whitespace-pre-line text-card-foreground leading-relaxed">
                    <h3 className="text-lg font-semibold mb-3 text-foreground">
                      💡 모의면접 코치 피드백
                    </h3>
                    {feedback}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </div>
      </main>
    </ProtectedPage>
  );
}
