"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ProtectedPage from "@/app/_contexts/ProtectedPage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HeartPulse, ChevronRight, History, Sparkles, Trash2 } from "lucide-react";
import { API_URL, authHeaders, extractDetail, getErrorMessage } from "@/lib/api";

type HistoryItem = {
  result_id: string;
  score: number;
  grade: string;
  created_at: string;
};

export default function SeniorHomePage() {
  const router = useRouter();
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/senior/history`, { headers: authHeaders() })
      .then((res) => (res.ok ? res.json() : { items: [] }))
      .then((json) => setHistory(Array.isArray(json?.items) ? json.items : []))
      .catch(() => setHistory([]));
  }, []);

  const deleteHistory = async (resultId: string) => {
    if (!confirm("이 진단 결과를 삭제할까요?")) return;

    setDeletingId(resultId);
    try {
      const res = await fetch(`${API_URL}/senior/history/${resultId}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(extractDetail(payload, "진단 결과 삭제에 실패했습니다."));
      }
      setHistory((prev) => prev.filter((item) => item.result_id !== resultId));
    } catch (err) {
      alert(getErrorMessage(err, "진단 결과 삭제에 실패했습니다."));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
          <div className="text-center">
            <div className="mx-auto mb-6 inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <HeartPulse className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
              노후 준비 체크
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-base text-muted-foreground">
              간단한 질문 18개에 답하면 나의 노후 준비 상태를
              재무 · 건강 · 여가 · 대인관계 4가지 영역으로 진단해드립니다.
              <br />
              약 5분이 소요되며, 답변은 결과 확인에만 사용됩니다.
            </p>
          </div>

          <Card className="mt-10 border-2 border-primary/20">
            <CardContent className="flex flex-col items-center gap-6 p-8">
              <div className="grid w-full grid-cols-2 gap-3 text-center text-sm">
                <div className="rounded-xl bg-muted/60 p-4">
                  <p className="text-2xl font-bold text-primary">4</p>
                  <p className="text-muted-foreground">진단 영역</p>
                </div>
                <div className="rounded-xl bg-muted/60 p-4">
                  <p className="text-2xl font-bold text-primary">100</p>
                  <p className="text-muted-foreground">만점 점수</p>
                </div>
                <div className="rounded-xl bg-muted/60 p-4">
                  <p className="text-2xl font-bold text-primary">A~D</p>
                  <p className="text-muted-foreground">준비 등급</p>
                </div>
                <div className="rounded-xl bg-muted/60 p-4">
                  <p className="text-2xl font-bold text-primary">AI</p>
                  <p className="text-muted-foreground">맞춤 조언</p>
                </div>
              </div>

              <Button
                size="lg"
                className="w-full py-6 text-lg"
                onClick={() => router.push("/senior/survey")}
              >
                <Sparkles className="mr-2 h-5 w-5" />
                진단 시작하기
              </Button>
            </CardContent>
          </Card>

          {history.length > 0 && (
            <Card className="mt-6">
              <CardContent className="p-6">
                <div className="mb-4 flex items-center gap-2 text-lg font-semibold text-foreground">
                  <History className="h-5 w-5 text-primary" />
                  내 이전 진단 결과
                </div>
                <div className="space-y-2">
                  {history.map((h) => (
                    <div
                      key={h.result_id}
                      className="flex w-full items-center gap-2 rounded-xl border border-border bg-muted/40 px-4 py-3 transition hover:bg-muted/70"
                    >
                      <button
                        type="button"
                        onClick={() => router.push(`/senior/result/${h.result_id}`)}
                        className="flex min-w-0 flex-1 items-center justify-between text-left"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {h.created_at}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            등급 {h.grade} · {h.score}점
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </button>
                      <button
                        type="button"
                        aria-label="진단 결과 삭제"
                        title="진단 결과 삭제"
                        onClick={() => deleteHistory(h.result_id)}
                        disabled={deletingId === h.result_id}
                        className="rounded-full p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ProtectedPage>
  );
}
