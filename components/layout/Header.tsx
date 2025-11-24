"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
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
    <header className="w-full flex justify-between items-center px-8 py-4 border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
      {/* 로고 */}
      <h1
        className="text-xl font-bold text-foreground cursor-pointer"
        onClick={() => router.push("/")}
      >
        Plainpaper ✨
      </h1>

      {/* 우측 메뉴 */}
      <div className="flex items-center gap-3">

        {isLoggedIn && (
          <span className="text-muted-foreground font-medium">
            {user?.name}님 반갑습니다 👋
          </span>
        )}
        <ModeToggle />
        <Button
          variant="ghost"
          className="text-muted-foreground hover:text-foreground"
          onClick={() => router.push("/mypage")}
        >
          마이페이지
        </Button>

        <Button
          variant="outline"
          className="text-muted-foreground hover:text-foreground"
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