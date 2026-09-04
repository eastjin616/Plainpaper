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
import { LayoutGrid, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/app/_contexts/AuthContext";
import SeniorHubModal from "@/components/dashboard/SeniorHubModal";

export default function Header() {
  const router = useRouter();
  const { user, isLoggedIn, logout } = useAuth();
  const [hubOpen, setHubOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="w-full border-b border-border bg-background/80 backdrop-blur sticky top-0 z-50">
      <SeniorHubModal open={hubOpen} onOpenChange={setHubOpen} />
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-8 sm:py-4">
        {/* 로고 */}
        <h1
          className="text-lg font-bold text-foreground cursor-pointer sm:text-xl"
          onClick={() => router.push("/")}
        >
          Plainpaper ✨
        </h1>

        {/* 데스크톱 메뉴 */}
        <div className="hidden items-center gap-3 sm:flex">
          {isLoggedIn && (
            <span className="text-muted-foreground font-medium whitespace-nowrap">
              {user?.name}님 반갑습니다 👋
            </span>
          )}
          {isLoggedIn && (
            <>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => setHubOpen(true)}
              >
                <LayoutGrid className="h-4 w-4" />
                기능 선택
              </Button>
            </>
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
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
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
                {isLoggedIn && (
                  <Button
                    variant="default"
                    className="justify-start"
                    onClick={() => {
                      setSheetOpen(false);
                      setHubOpen(true);
                    }}
                  >
                    <LayoutGrid className="mr-2 h-4 w-4" />
                    기능 선택
                  </Button>
                )}
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
