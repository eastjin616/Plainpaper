"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_contexts/AuthContext";

export default function Header() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");      
    localStorage.removeItem("user");       
    logout();                              
    router.push("/login");
  };

  return (
    <header className="w-full flex justify-between items-center px-8 py-4 border-b border-zinc-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      {/* 로고 */}
      <h1
        className="text-xl font-bold text-zinc-900 cursor-pointer"
        onClick={() => router.push("/upload")}
      >
        Plainpaper ✨
      </h1>

      {/* 우측 메뉴 */}
      <div className="flex items-center gap-3">

        {isLoggedIn && (
          <span className="text-zinc-700 font-medium">
            {user?.name}님 반갑습니다 👋
          </span>
        )}

        <Button
          variant="ghost"
          className="text-zinc-700 hover:text-zinc-900"
          onClick={() => router.push("/mypage")}
        >
          마이페이지
        </Button>

        <Button
          variant="outline"
          className="text-zinc-700 hover:text-zinc-900"
          onClick={() => router.push("/setting")}
        >
          설정
        </Button>

        <Button variant="destructive" onClick={handleLogout}>
          로그아웃
        </Button>
      </div>
    </header>
  );
}