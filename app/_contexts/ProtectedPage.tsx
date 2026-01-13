"use client";

import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();
  const bypassAuth =
    process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true" &&
    process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (bypassAuth) return;
    if (loading) return;              // ⭐ 로딩 중이면 아무 것도 하지 않음
    if (!isLoggedIn) router.push("/login");
  }, [bypassAuth, loading, isLoggedIn, router]);

  if (bypassAuth) return <>{children}</>;
  if (loading) return null;           // ⭐ localStorage 읽는 동안 화면 깜빡임 방지
  if (!isLoggedIn) return null;       // ⭐ 로그인 전엔 렌더링 X

  return <>{children}</>;
}
