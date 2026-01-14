"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedPage from "@/app/_contexts/ProtectedPage";

export default function BoardDetailPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/board");
  }, [router]);

  return (
    <ProtectedPage>
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        이동 중입니다...
      </main>
    </ProtectedPage>
  );
}
