"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background p-6 text-center">
      <h1 className="text-2xl font-bold text-foreground">문제가 발생했습니다</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        요청을 처리하는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.
      </p>
      {error.message && (
        <p className="max-w-md break-words text-xs text-destructive">
          {error.message}
        </p>
      )}
      <Button onClick={reset} variant="outline">
        다시 시도
      </Button>
    </main>
  );
}
