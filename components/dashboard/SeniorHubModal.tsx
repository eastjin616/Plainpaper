"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X, FileText, HeartPulse } from "lucide-react";

type SeniorHubModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function SeniorHubModal({
  open,
  onOpenChange,
}: SeniorHubModalProps) {
  const router = useRouter();

  // 열리면 뒤 화면 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  const close = () => onOpenChange(false);

  const go = (path: string) => {
    close();
    router.push(path);
  };

  // backdrop-blur 등이 있는 조상(fixed 기준 좌표계)에서 벗어나 body에 직접 렌더링
  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-background p-8 shadow-2xl">
        <button
          onClick={close}
          aria-label="닫기"
          className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground transition hover:bg-muted hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">
            무엇을 도와드릴까요?
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            원하는 기능을 선택해주세요. 언제든 대시보드에서 다시 찾을 수 있어요.
          </p>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <button
            onClick={() => go("/upload")}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-border p-6 text-center transition hover:border-primary hover:bg-primary/5"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/10">
              <FileText className="h-7 w-7 text-blue-500" />
            </span>
            <span className="text-lg font-semibold text-foreground">
              문서 분석
            </span>
            <span className="text-xs leading-relaxed text-muted-foreground">
              문서를 업로드하고 AI 요약·위험도 분석·Q&A까지
            </span>
          </button>

          <button
            onClick={() => go("/senior")}
            className="group flex flex-col items-center gap-3 rounded-2xl border-2 border-border p-6 text-center transition hover:border-primary hover:bg-primary/5"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">
              <HeartPulse className="h-7 w-7 text-green-500" />
            </span>
            <span className="text-lg font-semibold text-foreground">
              노후 준비 체크
            </span>
            <span className="text-xs leading-relaxed text-muted-foreground">
              4가지 영역으로 나의 노후 준비 상태를 진단
            </span>
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}
