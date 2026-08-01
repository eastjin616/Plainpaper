"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./_contexts/AuthContext";
import { ArrowRight, FileSearch, PenLine, Mic, Kanban, Github } from "lucide-react";
import { Button } from "@/components/ui/button";

const FEATURES = [
  {
    icon: FileSearch,
    title: "이력서 ATS 분석",
    desc: "자동 서류심사(ATS)가 실제로 보는 기준으로 점수를 매기고, 개선 포인트를 알려줍니다.",
  },
  {
    icon: PenLine,
    title: "자소서 AI 첨삭",
    desc: "흔한 문장은 구체적인 경험으로. AI 첨삭 전문가가 다듬어드립니다.",
  },
  {
    icon: Mic,
    title: "AI 모의면접",
    desc: "내 이력서를 읽은 면접관이 질문하고, STAR 구조로 답변을 평가합니다.",
  },
  {
    icon: Kanban,
    title: "지원 트래커",
    desc: "지원/서류/면접/합격까지 지원 현황을 한눈에 관리하세요.",
  },
];

export default function LandingPage() {
  const router = useRouter();
  const { isLoggedIn, loading } = useAuth();

  useEffect(() => {
    if (!loading && isLoggedIn) {
      router.replace("/dashboard");
    }
  }, [isLoggedIn, loading, router]);

  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      {/* 배경 그라디언트 */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -top-32 right-[-10%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_rgba(14,165,233,0.25),_rgba(255,255,255,0))]" />
        <div className="absolute -bottom-40 left-[-10%] h-96 w-96 rounded-full bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.28),_rgba(255,255,255,0))]" />
      </div>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-6 py-16 md:py-24">
        {/* 헤더 */}
        <nav className="flex items-center justify-between">
          <span className="text-xl font-bold text-foreground">
            CareerPilot <span className="align-middle text-sm">✈️</span>
          </span>
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/eastjin616/Plainpaper"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <Button
              variant="ghost"
              onClick={() => router.push("/login")}
            >
              로그인
            </Button>
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => router.push("/signup")}
            >
              무료 시작
            </Button>
          </div>
        </nav>

        {/* 히어로 */}
        <section className="flex flex-col items-center gap-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs text-muted-foreground shadow-sm">
            <span className="text-primary">Open Source</span> · MIT License
          </div>
          <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-6xl">
            이력서를 올리면,
            <br />
            <span className="bg-gradient-to-r from-sky-500 to-amber-500 bg-clip-text text-transparent">
              합격이 보입니다
            </span>
          </h1>
          <p className="max-w-xl text-base text-muted-foreground md:text-lg">
            ATS 분석부터 자소서 첨삭, 모의면접까지. AI 취업 코파일럿이 당신의
            취업 여정을 끝까지 동행합니다.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
              onClick={() => router.push("/signup")}
            >
              지금 시작하기
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              className="px-8 py-6 text-lg"
              onClick={() => router.push("/login")}
            >
              로그인
            </Button>
          </div>
        </section>

        {/* 기능 카드 */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border bg-card/60 p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <feature.icon className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </section>

        {/* 오픈소스 CTA */}
        <section className="rounded-2xl border border-border bg-card/60 p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-3">
            완전한 셀프호스트 가능, 프라이버시는 내 손에
          </h2>
          <p className="max-w-xl mx-auto text-muted-foreground mb-6">
            이력서는 가장 민감한 개인정보 중 하나입니다. Docker Compose 한 줄로
            내 서버에서 내 데이터만으로 구동하세요.
          </p>
          <a
            href="https://github.com/eastjin616/Plainpaper"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-6 py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors"
          >
            <Github className="w-4 h-4" />
            GitHub에서 보기 ⭐
          </a>
        </section>

        {/* 푸터 */}
        <footer className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          © 2026 CareerPilot. Open source · MIT License
        </footer>
      </div>
    </main>
  );
}
