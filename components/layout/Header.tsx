"use client";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
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
    <header className="w-full border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        {/* 로고 */}
        <h1
          className="text-lg font-bold text-foreground cursor-pointer sm:text-xl"
          onClick={() => router.push("/dashboard")}
        >
          CareerPilot ✨
        </h1>

        {/* 데스크톱 메뉴 */}
        <div className="hidden items-center gap-3 sm:flex">
          {isLoggedIn && (
            <span className="text-muted-foreground font-medium whitespace-nowrap">
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

        {/* 모바일 메뉴 */}
        <div className="sm:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="메뉴 열기">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-6">
              <SheetHeader>
                <SheetTitle>메뉴</SheetTitle>
                <SheetDescription>필요한 작업을 선택하세요.</SheetDescription>
              </SheetHeader>

              <div className="mt-6 flex flex-col gap-3">
                {isLoggedIn && (
                  <span className="text-muted-foreground text-sm">
                    {user?.name}님 반갑습니다 👋
                  </span>
                )}
                <ModeToggle />
                <Button
                  variant="ghost"
                  className="justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => router.push("/mypage")}
                >
                  마이페이지
                </Button>
                <Button
                  variant="outline"
                  className="justify-start text-muted-foreground hover:text-foreground"
                  onClick={() => router.push("/setting")}
                >
                  설정
                </Button>
                <Button variant="destructive" onClick={handleLogout}>
                  로그아웃
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
