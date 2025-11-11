import Header from "@/components/layout/Header";
import { ReactNode } from "react";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ko">
      <body className="bg-gradient-to-b from-zinc-50 to-zinc-100 min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center">
          {children}
        </main>
        <footer className="py-6 text-center text-zinc-400 text-sm border-t border-zinc-100">
          © 2025 Plainpaper. All rights reserved.
        </footer>
      </body>
    </html>
  );
}
