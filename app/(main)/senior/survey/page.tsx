"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ProtectedPage from "@/app/_contexts/ProtectedPage";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  Save,
  Trash2,
} from "lucide-react";
import type { SeniorQuestion } from "@/app/_types/senior";
import { API_URL, authHeaders, extractDetail, getErrorMessage } from "@/lib/api";

const DRAFT_KEY = "plainpaper_survey_draft";

type Draft = {
  answers: Record<string, unknown>;
  queue: SeniorQuestion[];
  index: number;
};

const loadDraft = (): Draft | null => {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Draft;
    if (
      !parsed ||
      !parsed.answers ||
      typeof parsed.answers !== "object" ||
      Array.isArray(parsed.answers) ||
      !Array.isArray(parsed.queue)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

const clearDraft = () => {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // ignore
  }
};

const DOMAIN_LABEL: Record<string, string> = {
  financial: "재무",
  health: "건강",
  leisure: "여가",
  relationship: "대인관계",
};

const DOMAIN_COLOR: Record<string, string> = {
  financial: "bg-blue-500",
  health: "bg-green-500",
  leisure: "bg-purple-500",
  relationship: "bg-orange-500",
};

export default function SeniorSurveyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [queue, setQueue] = useState<SeniorQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [baseQuestions, setBaseQuestions] = useState<SeniorQuestion[]>([]);
  const [hasDraft, setHasDraft] = useState(false);
  const restoringRef = useRef(false);

  useEffect(() => {
    fetch(`${API_URL}/senior/questions`)
      .then((res) => {
        if (!res.ok) throw new Error("문항을 불러오지 못했습니다.");
        return res.json();
      })
      .then((json) => {
        const qs = Array.isArray(json?.questions) ? json.questions : [];
        setBaseQuestions(qs);
        const saved = loadDraft();
        if (saved && saved.queue.length > 0) {
          setHasDraft(true);
        } else {
          setQueue(qs);
        }
        setLoading(false);
      })
      .catch((e) => {
        setError(getErrorMessage(e, "문항을 불러오지 못했습니다."));
        setLoading(false);
      });
  }, []);

  // 답변/진행 상태 자동 임시저장
  useEffect(() => {
    if (loading || restoringRef.current || queue.length === 0) return;
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ answers, queue, index } satisfies Draft)
      );
    } catch {
      // ignore
    }
  }, [answers, queue, index, loading]);

  // 작성 중 이탈 시 브라우저 경고
  useEffect(() => {
    if (Object.keys(answers).length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [answers]);

  const resumeDraft = useCallback(() => {
    const saved = loadDraft();
    if (!saved) return;
    restoringRef.current = true;
    setAnswers(saved.answers);
    setQueue(saved.queue);
    setIndex(Math.min(saved.index, saved.queue.length - 1));
    setHasDraft(false);
    setError(null);
    setTimeout(() => {
      restoringRef.current = false;
    }, 0);
  }, []);

  const restartSurvey = useCallback(() => {
    clearDraft();
    setAnswers({});
    setQueue(baseQuestions);
    setIndex(0);
    setHasDraft(false);
    setError(null);
  }, [baseQuestions]);

  const question = queue[index];
  const totalCount = queue.length;

  const setAnswer = useCallback(
    (id: string, value: unknown) => {
      setAnswers((prev) => ({ ...prev, [id]: value }));
    },
    []
  );

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/senior/submit`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ answers }),
      });
      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(extractDetail(payload, "결과 저장에 실패했습니다."));
      }
      const json = await res.json();
      clearDraft();
      router.push(`/senior/result/${json.result_id}`);
    } catch (e) {
      setError(getErrorMessage(e, "결과 저장에 실패했습니다."));
      setSubmitting(false);
    }
  }, [answers, router]);

  const handleNext = useCallback(() => {
    if (!question) return;

    const value = answers[question.id];

    // 다중선택: 빈 배열도 제출 가능 (선택 없음 = 허용)
    if (question.type === "multi-select" && Array.isArray(value)) {
      // ok
    } else if (
      value === undefined ||
      value === null ||
      value === "" ||
      (typeof value === "number" && Number.isNaN(value))
    ) {
      setError("답변을 선택하거나 입력해주세요.");
      return;
    }

    setError(null);

    // followUp 질문 큐에 삽입
    let nextQueue = queue;
    if (question.followUp) {
      const show =
        question.followUp.condition === "true"
          ? value === true || value === "true"
          : Number(value) > 0;
      if (show) {
        nextQueue = [
          ...queue.slice(0, index + 1),
          question.followUp.question,
          ...queue.slice(index + 1),
        ];
        setQueue(nextQueue);
      }
    }

    if (index + 1 >= nextQueue.length) {
      handleSubmit();
    } else {
      setIndex((i) => i + 1);
    }
  }, [question, answers, index, queue, handleSubmit]);

  const handleBack = useCallback(() => {
    setError(null);
    if (index > 0) setIndex((i) => i - 1);
  }, [index]);

  const progress = useMemo(
    () => (totalCount ? Math.round(((index + 1) / totalCount) * 100) : 0),
    [index, totalCount]
  );

  if (loading) {
    return (
      <ProtectedPage>
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </ProtectedPage>
    );
  }

  if (hasDraft) {
    const saved = loadDraft();
    const answeredCount = saved ? Object.keys(saved.answers).length : 0;
    return (
      <ProtectedPage>
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
            <Card className="border-2 border-primary/30">
              <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Save className="h-7 w-7 text-primary" />
                </span>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    작성 중인 답변이 임시 저장되어 있어요
                  </h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    지금까지 {answeredCount}문항에 답변했습니다.
                    <br />
                    이어서 작성할까요? (나가더라도 답변은 자동 저장됩니다)
                  </p>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button size="lg" onClick={resumeDraft}>
                    <Save className="mr-2 h-4 w-4" />
                    이어서 작성
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    onClick={restartSurvey}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    새로 시작
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </ProtectedPage>
    );
  }

  if (!question) {
    return (
      <ProtectedPage>
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-muted-foreground">문항이 없습니다.</p>
        </div>
      </ProtectedPage>
    );
  }

  const value = answers[question.id];

  return (
    <ProtectedPage>
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          {/* 진행 바 */}
          <div className="mb-3 flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {index + 1} / {totalCount}
            </span>
            <span className="flex items-center gap-1">
              <Save className="h-3.5 w-3.5" />
              자동 임시저장됨
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-2 rounded-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* 영역 뱃지 */}
          <div className="mt-8 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-white ${DOMAIN_COLOR[question.domain] ?? "bg-primary"}`}
            >
              {DOMAIN_LABEL[question.domain] ?? question.domain}
            </span>
            <span className="text-xs text-muted-foreground">
              노후 준비 진단
            </span>
          </div>

          <Card className="mt-4">
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-bold leading-relaxed text-foreground sm:text-3xl">
                {question.title}
              </h2>

              {error && (
                <p className="mt-4 rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}

              {/* boolean / select */}
              {(question.type === "select" || question.type === "boolean") &&
                question.options && (
                  <div className="mt-8 grid gap-3">
                    {question.options.map((opt) => {
                      const selected = value === opt.value;
                      return (
                        <button
                          key={opt.value}
                          onClick={() => setAnswer(question.id, opt.value)}
                          className={`rounded-2xl border-2 px-5 py-5 text-left text-lg transition ${
                            selected
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-card text-foreground hover:border-primary/50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                )}

              {/* multi-select */}
              {question.type === "multi-select" &&
                question.options && (
                  <div className="mt-8 grid gap-3">
                    {question.options.map((opt) => {
                      const selected = Array.isArray(value) && value.includes(opt.value);
                      return (
                        <button
                          key={opt.value}
                          onClick={() => {
                            const cur = Array.isArray(value) ? value : [];
                            setAnswer(
                              question.id,
                              selected
                                ? cur.filter((v) => v !== opt.value)
                                : [...cur, opt.value]
                            );
                          }}
                          className={`rounded-2xl border-2 px-5 py-5 text-left text-lg transition ${
                            selected
                              ? "border-primary bg-primary/10 text-foreground"
                              : "border-border bg-card text-foreground hover:border-primary/50"
                          }`}
                        >
                          {opt.label}
                          {selected && (
                            <span className="float-right text-primary">✓</span>
                          )}
                        </button>
                      );
                    })}
                    <p className="mt-1 text-xs text-muted-foreground">
                      ※ 여러 개 선택할 수 있어요. (없으면 그대로 다음으로)
                    </p>
                  </div>
                )}

              {/* amount / number */}
              {(question.type === "amount" || question.type === "number") && (
                <div className="mt-8 flex items-center gap-3">
                  <Input
                    type="number"
                    inputMode="numeric"
                    step={question.step}
                    placeholder={question.placeholder ?? "숫자를 입력하세요"}
                    className="h-16 text-2xl"
                    value={value === undefined ? "" : String(value)}
                    onChange={(e) =>
                      setAnswer(question.id, e.target.value === "" ? "" : Number(e.target.value))
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleNext();
                    }}
                  />
                  {question.unit && (
                    <span className="text-xl font-medium text-muted-foreground">
                      {question.unit}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 하단 버튼 */}
          <div className="mt-6 flex items-center justify-between">
            <Button
              variant="outline"
              size="lg"
              onClick={handleBack}
              disabled={index === 0}
            >
              <ChevronLeft className="mr-1 h-5 w-5" />
              이전
            </Button>
            <Button size="lg" onClick={handleNext} disabled={submitting}>
              {submitting ? (
                <Loader2 className="mr-1 h-5 w-5 animate-spin" />
              ) : (
                <>
                  {index + 1 >= totalCount ? "결과 확인" : "다음"}
                  <ChevronRight className="ml-1 h-5 w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </ProtectedPage>
  );
}
