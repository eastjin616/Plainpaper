"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Sparkles, Wand2, ArrowLeft, CheckCircle2, Copy } from "lucide-react";
import { useRouter } from "next/navigation";

import ProtectedPage from "@/app/_contexts/ProtectedPage";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const SAMPLE_ESSAYS = [
  "지원동기: 개발자로서 사용자에게 실제 가치를 주는 제품을 만들고 싶어 지원했습니다. 대학에서 컴퓨터공학을 전공하며 소프트웨어가 세상을 바꾼다는 것을 직접 경험했습니다.",
  "성장과정: 처음 개발을 시작했을 때는 기초 지식이 부족했습니다. 하지만 매일 2시간씩 코딩 테스트를 풀고, 실패한 프로젝트를 분석하며 성장했습니다.",
];

export default function EssayPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [revised, setRevised] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRevise = async () => {
    if (!content.trim()) {
      alert("자소서 내용을 입력해주세요.");
      return;
    }

    setLoading(true);
    setRevised("");
    setFeedback("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_URL}/essay/revise`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          text: content,
          title: title || "제목 없는 자소서",
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => null);
        throw new Error(err?.detail ?? "첨삭에 실패했습니다.");
      }

      const json = await res.json();
      setRevised(json.revised);
      setFeedback(json.feedback);
    } catch (err) {
      console.error("🔥 첨삭 실패:", err);
      alert(err instanceof Error ? err.message : "첨삭에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const copyResult = async () => {
    if (!revised) return;
    await navigator.clipboard.writeText(revised);
    alert("첨삭 결과가 복사되었습니다.");
  };

  return (
    <ProtectedPage>
      <main className="min-h-screen bg-background px-6 py-10">
        <div className="max-w-5xl mx-auto">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-8">
            <button
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
              onClick={() => router.push("/dashboard")}
            >
              <ArrowLeft className="w-4 h-4" />
              대시보드
            </button>
          </div>

          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Wand2 className="w-8 h-8 text-primary" />
            자소서 AI 첨삭
          </h1>
          <p className="text-muted-foreground mb-8">
            흔한 문장은 구체적으로, 추상적 표현은 경험 기반으로. AI 첨삭 전문가가 다듬어드립니다.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* 좌측: 입력 */}
            <div className="space-y-4">
              <Card className="shadow-md border-border bg-card/80">
                <CardContent className="p-6 space-y-4">
                  <Input
                    placeholder="제목 (예: 2026 상반기 개발자 지원동기)"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                  <Textarea
                    placeholder="자소서 내용을 입력하세요 (500자 내외 권장)"
                    className="min-h-[300px] resize-y"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />

                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_ESSAYS.map((sample, i) => (
                      <button
                        key={i}
                        className="px-3 py-1 rounded-full bg-muted text-xs text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={() => setContent(sample)}
                      >
                        예시 {i + 1}
                      </button>
                    ))}
                  </div>

                  <Button
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 text-base py-6"
                    onClick={handleRevise}
                    disabled={loading}
                  >
                    <Sparkles className="w-5 h-5 mr-2" />
                    {loading ? "첨삭 중..." : "AI 첨삭 시작"}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* 우측: 결과 */}
            <div className="space-y-4">
              {!revised ? (
                <Card className="shadow-md border-dashed border-border bg-card/40">
                  <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px] text-center">
                    <Wand2 className="w-12 h-12 text-muted-foreground/40 mb-4" />
                    <p className="text-muted-foreground">
                      첨삭 결과가 여기에 표시됩니다.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card className="shadow-md border-emerald-500/30 bg-card/80">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2 text-emerald-600">
                          <CheckCircle2 className="w-5 h-5" />
                          첨삭 결과
                        </h2>
                        <Button variant="outline" size="sm" onClick={copyResult}>
                          <Copy className="w-4 h-4 mr-1" />
                          복사
                        </Button>
                      </div>
                      <p className="whitespace-pre-line text-card-foreground leading-relaxed">
                        {revised}
                      </p>
                    </CardContent>
                  </Card>

                  {feedback && (
                    <Card className="shadow-md border-border bg-card/80">
                      <CardContent className="p-6">
                        <h2 className="text-lg font-semibold mb-3 text-foreground">
                          💡 피드백
                        </h2>
                        <ul className="space-y-2">
                          {feedback
                            .split("\n")
                            .filter((l) => l.trim().startsWith("-"))
                            .map((line, i) => (
                              <li
                                key={i}
                                className="text-card-foreground leading-relaxed"
                              >
                                {line.trim()}
                              </li>
                            ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </ProtectedPage>
  );
}
