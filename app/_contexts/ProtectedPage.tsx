"use client";

import { useAuth } from "@/app/_contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedPage({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null; // 보호: 로그인 전엔 아무것도 안 보여줌

  return <>{children}</>;
}