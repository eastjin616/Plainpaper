import "./globals.css";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

export const metadata = {
  title: "Plainpaper",
  description: "복잡한 문서를 AI가 쉽게 해석해주는 서비스",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        {/* Header */}
        <header className="w-full flex items-center justify-between px-8 py-4 border-b border-zinc-200 bg-white/70 backdrop-blur">
          <Link href="/" className="text-xl font-bold text-zinc-800">
            Plainpaper ✨
          </Link>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">로그인</Link>
            </Button>
            <Button size="sm" className="bg-zinc-800 text-white hover:bg-zinc-900">
              <Link href="/signup">회원가입</Link>
            </Button>
          </div>
        </header>

        {/* Main content */}
        <main className="p-8">{children}</main>

        {/* Footer */}
        <footer className="text-center text-sm text-zinc-500 py-8">
          © 2025 Plainpaper. All rights reserved.
        </footer>
      </body>
    </html>
  );
}