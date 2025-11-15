import "./globals.css";
import type { Metadata } from "next";
import { AuthProvider } from "./_contexts/AuthContext";

export const metadata: Metadata = {
  title: "Plainpaper",
  description: "복잡한 문서를 AI가 쉽게 해석해주는 서비스",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        <AuthProvider>
          <main className="px-6 pt-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}