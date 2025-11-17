"use client";

import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;              // ⭐ 로딩 중이면 아무 것도 하지 않음
    if (!isLoggedIn) router.push("/login");
  }, [loading, isLoggedIn, router]);

  if (loading) return null;           // ⭐ localStorage 읽는 동안 화면 깜빡임 방지
  if (!isLoggedIn) return null;       // ⭐ 로그인 전엔 렌더링 X

  return <>{children}</>;
}