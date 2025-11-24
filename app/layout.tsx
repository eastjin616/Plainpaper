import "./globals.css";
import type { Metadata } from "next";
import AuthClientWrapper from "./_contexts/AuthClientWrapper";

export const metadata: Metadata = {
  title: "Plainpaper",
  description: "복잡한 문서를 AI가 쉽게 해석해주는 서비스",
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