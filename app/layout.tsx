import "./globals.css";
import type { Metadata } from "next";
import AuthClientWrapper from "./_contexts/AuthClientWrapper";

export const metadata: Metadata = {
  title: "CareerPilot",
  description: "오픈소스 AI 취업 코파일럿 — 이력서 분석, 자소서 첨삭, 모의면접을 한 곳에서",
};

import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <AuthClientWrapper>
            <main className="px-6 pt-8">{children}</main>
          </AuthClientWrapper>
        </Providers>
      </body>
    </html>
  );
}